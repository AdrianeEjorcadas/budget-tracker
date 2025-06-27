import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ReturnResponse } from '../models/return-response';
import { catchError, Observable, of } from 'rxjs';
import { environment } from '../environments/environment';
import { RegisterUserInteface } from '../models/interface/RegisterUserInteface';

@Injectable({
  providedIn: 'root'
})
export class UserApiService {
  private http= inject(HttpClient);
  constructor() { }

  isEmailExist(email: string): Observable<ReturnResponse<boolean>>{
    return this.http.get<ReturnResponse<boolean>>(`${environment.apiUrl}/${environment.userEndPoint}/email-exist?email=${encodeURIComponent(email)}`)
    .pipe(
      catchError(error => {
      console.error("Email checked failed," + error);
      return of({
        statusCode: 500,
        message: "Server Error",
        data: false
      } satisfies ReturnResponse<boolean>)
    }));
  }

  registerUserPost(user: RegisterUserInteface) : Observable<ReturnResponse<null>>{
    console.log('service : '+user.email);
    return this.http.post<ReturnResponse<null>>(`${environment.apiUrl}/${environment.userEndPoint}/create-user`,user)
    .pipe(
      catchError((error : any) => {
      console.log("Registration failed," + error);
        return of({
        statusCode: 500,
        message: "Server Error",
        data: null
        } satisfies ReturnResponse<null> ) 
      })
    )
  }

}
