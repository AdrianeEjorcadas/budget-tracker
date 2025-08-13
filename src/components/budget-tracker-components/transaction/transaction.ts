import { Component, inject, OnInit } from '@angular/core';
import { ModalService } from '../../../services/modal-service';
import { TestModal } from '../../../reusable/modal/test-modal/test-modal';
import { ModalHost } from '../../../reusable/modal/modal-host/modal-host';
import { TransactionApiService } from '../../../services/transaction-api-service';
import { AuthenticationTokenDetails } from '../../../models/interface/AuthenticationTokenDetails';
import { UserIdInterface } from '../../../models/interface/UserIdInterface';
import { UserApiService } from '../../../services/user-api-service';
import { Toastr } from '../../../reusable/toastr/toastr';

@Component({
  selector: 'app-transaction',
  imports: [ModalHost],
  templateUrl: './transaction.html',
  styleUrl: './transaction.css'
})
export class Transaction implements OnInit {

  private toastr = inject(Toastr);
  private modal = inject(ModalService);
  private userService = inject(UserApiService);
  private transactionService = inject(TransactionApiService);
  private token : AuthenticationTokenDetails = {
    authToken: '',
    refreshToken: '',
    authTokenExpiration: '',
    refreshTokenExpiration: ''
  }


  ngOnInit(): void {
    // this.token = this.getAuthToken();
    // this.getUserId(this.token);
  }


  openTest(){
    this.modal.open(TestModal, { message: 'Open Modal'});
  }


  // loadTransactions(){
  //   this.transactionService.retrieveTransactionGet$(userToken)
  // }

  // getAuthToken(){
  //   // return JSON.parse(sessionStorage.getItem('authToken') || 'null');
  //   return this.token = {
  //     authToken: (sessionStorage.getItem('authToken') ?? ''),
  //     refreshToken: (sessionStorage.getItem('refreshToken') ?? ''),
  //     authTokenExpiration: (sessionStorage.getItem('authTokenExpiration') ?? ''),
  //     refreshTokenExpiration: (sessionStorage.getItem('refreshTokenExpiration') ?? '')
  //   }
  // }

  // get user id by auth token
  // getUserId(authToken: AuthenticationTokenDetails){
  //   // console.log(authToken);
  //   this.userService.getUserDetailsPost(authToken).subscribe({
  //     next: (res) => {
  //       if(res.statusCode === 200){
  //         console.log(res);
  //         const userDetails = res.data?.userDetails as UserIdInterface;

  //        if (userDetails) {
  //         sessionStorage.setItem('userId', userDetails.userId ?? '');
  //         sessionStorage.setItem('userName', userDetails.userName ?? '');
  //         sessionStorage.setItem('email', userDetails.email ?? '');
  //       } else {
  //         console.warn('userDetails is undefined:', res.data);
  //     }


  //       } else if (res.statusCode === 404){
  //         console.log('No item found');        }
  //     },
  //     error: (err) => {
  //       console.error('Error during retrieving user data', err);
  //       this.toastr.errorToast('Something went wrong. Please contact admin');
  //     }
  //   })
  // }

}
