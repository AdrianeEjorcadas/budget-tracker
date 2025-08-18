import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ReturnResponse } from '../models/return-response';
import { environment } from '../environments/environment';
import { catchError, Observable, of } from 'rxjs';
import { UserIdInterface } from '../models/interface/UserIdInterface';

@Injectable({
  providedIn: 'root'
})
export class TransactionApiService {

  private http = inject(HttpClient);
  constructor() { }

  retrieveTransactionGet$(userId: UserIdInterface):Observable<ReturnResponse<null>>{
    return this.http.get<ReturnResponse<null>>(`${environment.transactionApuIrl}/${environment.transactionEndPoint}/get-transactions?userId=${encodeURIComponent(userId.userId)}`)
    .pipe(
      catchError(error => {
        console.error("Retrieving data failed", + error);
        return of({
          statusCode: 500,
          message: "Server error",
          data: null
        } satisfies ReturnResponse<null> )
      })
    );
  }
  


}
