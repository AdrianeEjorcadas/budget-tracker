import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ReturnResponse } from '../models/return-response';
import { environment } from '../environments/environment';
import { catchError, Observable, of } from 'rxjs';
import { UserIdInterface } from '../models/interface/UserIdInterface';
import { RedirectCommand } from '@angular/router';
import { Router } from '@angular/router';
import { AddTransactionInterface } from '../models/interface/AddTransactionInterface';
import { Toastr } from '../reusable/toastr/toastr';
import { CategoryInterface } from '../models/interface/budget-tracker-interface/CategoryInterface';
import { EditTransactionInterface } from '../models/interface/budget-tracker-interface/EditTransactionInterface';

@Injectable({
  providedIn: 'root'
})
export class TransactionApiService {

  private http = inject(HttpClient);
  private router = inject(Router);
  private toastr = inject(Toastr);
  constructor() { }

  retrieveTransactionGet$(userId: UserIdInterface):Observable<ReturnResponse<null>>{
    return this.http.get<ReturnResponse<null>>(`${environment.transactionApuIrl}/${environment.transactionEndPoint}/get-transactions?userId=${encodeURIComponent(userId.userId)}`)
    .pipe(
      catchError(error => {
        this.router.navigate(['/server-error'])
        console.error("Retrieving data failed", + error);
        return of({
          statusCode: 500,
          message: "Server error",
          data: null
        } satisfies ReturnResponse<null> )
      })
    );
  }

  retrieveTransactionByIdGet(transactiondId: string) : Observable<ReturnResponse<null>>{
    return this.http.get<ReturnResponse<null>>(`${environment.transactionApuIrl}/${environment.transactionEndPoint}/get-transaction?transactionId=${encodeURIComponent(transactiondId)}`)
    .pipe(
      catchError(error => {
        this.router.navigate(['/server-error'])
        console.error("Retrieving data failed", + error);
        return of({
          statusCode: 500,
          message: "Server error",
          data: null
        } satisfies ReturnResponse<null> )
      })
    );
  }

  retrieveCategoryGet$(): Observable<ReturnResponse<CategoryInterface[]>>{
    return this.http.get<ReturnResponse<CategoryInterface[]>>(`${environment.transactionApuIrl}/${environment.transactionEndPoint}/get-categories`)
    .pipe(
      catchError( error => {
        this.toastr.errorToast('Server Error');
        this.router.navigate(['/server-error']);
        return of({
          statusCode: 500,
          message: "Server error",
          data: []
        }satisfies ReturnResponse<CategoryInterface[]>)
      })
    );
  }

  addTransactionPost(newTransaction: AddTransactionInterface):Observable<ReturnResponse<null>>{
    return this.http.post<ReturnResponse<null>>(`${environment.transactionApuIrl}/${environment.transactionEndPoint}/add-transaction`, newTransaction)
    .pipe(
      catchError(error => {
        this.router.navigate(['/server-error'])
        console.error("Data registration failed", + error);
        return of({
          statusCode: 500,
          message: "Server error",
          data: null
        } satisfies ReturnResponse<null> )
      })
    );
  }
  

  updateTransactionPut(editTransaction: EditTransactionInterface): Observable<ReturnResponse<null>>{
    return this.http.put<ReturnResponse<null>>(`${environment.transactionApuIrl}/${environment.transactionEndPoint}/update-transaction`,editTransaction)
    .pipe(
      catchError(error => {
        this.router.navigate(['/server-error']);
        console.error("Data update failed", + error);
        return of({
          statusCode: 500,
          message: "Server error",
          data: null
        } satisfies ReturnResponse<null> )
      })
    )
  }



}
