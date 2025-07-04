import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ReturnResponse } from '../models/return-response';
import { catchError, Observable, of } from 'rxjs';
import { environment } from '../environments/environment';
import { RegisterUserInteface } from '../models/interface/RegisterUserInteface';
import { ForgotPasswordInterface } from '../models/interface/ForgotPasswordInterface';
import { LoginInterface } from '../models/interface/LoginInterface';
import { AuthenticationTokenDetails } from '../models/interface/AuthenticationTokenDetails';
import { ResetPasswordInterface } from '../models/interface/ResetPasswordInterface';

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
            message: "Login Failed",
            data: null
          } satisfies ReturnResponse<{token: AuthenticationTokenDetails} | null>)
      })
    )
  }

  confirmEmailPut(token: string): Observable<ReturnResponse<null>> {
    const params = new HttpParams().set('ConfirmationToken',token);
    return this.http.put<ReturnResponse<null>>(`${environment.apiUrl}/${environment.userEndPoint}/confirm-email`, null, {params})
    .pipe(
      catchError((error:any) => {
        console.error('Login failed:', error?.error || error?.message || error);
          return of({
            statusCode: 500,
            message: "Confirmation Email Failed",
            data: null
          } satisfies ReturnResponse<null>)
      })
    )
  }

  resetPasswordPut(token:string, reset: ResetPasswordInterface) : Observable<ReturnResponse<null>> {
    const params = new HttpParams().set('token', token);
    return this.http.put<ReturnResponse<null>>(`${environment.apiUrl}/${environment.userEndPoint}/reset-password`, reset, {params})
    .pipe(
      catchError((error: any) => {
        console.error('Login failed:', error?.error || error?.message || error);
          return of({
            statusCode: 500,
            message: "Confirmation Email Failed",
            data: null
          } satisfies ReturnResponse<null>)
      })
    )
  }

}
