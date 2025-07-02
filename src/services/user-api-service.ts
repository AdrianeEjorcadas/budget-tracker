import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ReturnResponse } from '../models/return-response';
import { catchError, Observable, of } from 'rxjs';
import { environment } from '../environments/environment';
import { RegisterUserInteface } from '../models/interface/RegisterUserInteface';
import { ForgotPasswordInterface } from '../models/interface/ForgotPasswordInterface';
import { LoginInterface } from '../models/interface/LoginInterface';
import { AuthenticationTokenDetails } from '../models/interface/AuthenticationTokenDetails';

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

  forgotPasswordPost(email: ForgotPasswordInterface) : Observable<ReturnResponse<null>> {
    return this.http.post<ReturnResponse<null>>(`${environment.apiUrl}/${environment.userEndPoint}/forgot-password`, email)
    .pipe(
      catchError((error: any) => {
        console.log('Registration failed' + error);
          return of({
            statusCode : 500,
            message: "Server Error",
            data: null
          } satisfies ReturnResponse<null>)
      })
    )
  }

  loginUserPost(user: LoginInterface): Observable<ReturnResponse<{token: AuthenticationTokenDetails} | null>>{ 
    return this.http.put<ReturnResponse<{token: AuthenticationTokenDetails} | null>>(`${environment.apiUrl}/${environment.userEndPoint}/login`, user)
    .pipe(
      catchError((error: any) => {
        console.error('Login failed:', error?.error || error?.message || error);
          return of({
            statusCode: 500,
            message: "Server Error",
            data: null
          } satisfies ReturnResponse<{token: AuthenticationTokenDetails} | null>)
      })
    )
  }

}
