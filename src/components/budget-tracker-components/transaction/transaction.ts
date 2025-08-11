import { Component, inject, OnInit } from '@angular/core';
import { ModalService } from '../../../services/modal-service';
import { TestModal } from '../../../reusable/modal/test-modal/test-modal';
import { ModalHost } from '../../../reusable/modal/modal-host/modal-host';
import { TransactionApiService } from '../../../services/transaction-api-service';
import { AuthenticationTokenDetails } from '../../../models/interface/AuthenticationTokenDetails';
@Component({
  selector: 'app-transaction',
  imports: [ModalHost],
  templateUrl: './transaction.html',
  styleUrl: './transaction.css'
})
export class Transaction implements OnInit {

  private modal = inject(ModalService);
  private transactionService = inject(TransactionApiService);
  private token : AuthenticationTokenDetails = {
    authToken: '',
    refreshToken: '',
    authTokenExpiration: '',
    refreshTokenExpiration: ''
  }


  ngOnInit(): void {
    this.token = this.getAuthToken();
    this.getUserId(this.token);
  }


  openTest(){
    this.modal.open(TestModal, { message: 'Open Modal'});
  }


  // loadTransactions(){
  //   this.transactionService.retrieveTransactionGet$(userToken)
  // }

  getAuthToken(){
    // return JSON.parse(sessionStorage.getItem('authToken') || 'null');
    return this.token = {
      authToken: (sessionStorage.getItem('authToken') ?? ''),
      refreshToken: (sessionStorage.getItem('refreshToken') ?? ''),
      authTokenExpiration: (sessionStorage.getItem('authTokenExpiration') ?? ''),
      refreshTokenExpiration: (sessionStorage.getItem('refreshTokenExpiration') ?? '')
    }
  }

  // get user id by auth token
  getUserId(authToken: AuthenticationTokenDetails){
    console.log(authToken);
  }

}
