import { Component, inject, OnInit } from '@angular/core';
import { ModalService } from '../../../services/modal-service';
import { TestModal } from '../../../reusable/modal/test-modal/test-modal';
import { ModalHost } from '../../../reusable/modal/modal-host/modal-host';
import { TransactionApiService } from '../../../services/transaction-api-service';
import { AuthenticationTokenDetails } from '../../../models/interface/AuthenticationTokenDetails';
import { UserIdInterface } from '../../../models/interface/UserIdInterface';
import { UserApiService } from '../../../services/user-api-service';
import { Toastr } from '../../../reusable/toastr/toastr';
import { TransactionInterface } from '../../../models/interface/budget-tracker-interface/TransactionInterface';
import { ReturnResponse } from '../../../models/return-response';
import { AddTransaction } from '../../modal-components/add-transaction/add-transaction';
import {MatDialogModule, MatDialog} from '@angular/material/dialog';
import { EditTransaction } from '../../modal-components/edit-transaction/edit-transaction';
import { DeleteTransaction } from '../../modal-components/delete-transaction/delete-transaction';

@Component({
  selector: 'app-transaction',
  imports: [ModalHost, MatDialogModule],
  templateUrl: './transaction.html',
  styleUrl: './transaction.css'
})
export class Transaction implements OnInit {

  private toastr = inject(Toastr);
  private modal = inject(ModalService);
  private dialog = inject(MatDialog);
  private userService = inject(UserApiService);
  private transactionService = inject(TransactionApiService);
  private token : AuthenticationTokenDetails = {
    authToken: '',
    refreshToken: '',
    authTokenExpiration: '',
    refreshTokenExpiration: ''
  };

  private userDetails: UserIdInterface = {
    userId: '',
    userName: '',
    email: ''
  };

  categories: string[] = [];

  protected isLoading : boolean = true;
  protected transactions: TransactionInterface[] | null = null;

  ngOnInit(): void {
    // this.token = this.getAuthToken();
    // this.getUserId(this.token);
    this.getUserDetails();
    this.loadTransactions();
  }

  openTest(){
    const dialogRef = this.dialog.open(AddTransaction, {
      width: '400px',
      disableClose: true,
      data: this.categories 
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('AddTransaction Dialog result:', result);
      }
    });
  }

  editTransaction(transactionId: string){
    const dialogRef = this.dialog.open(EditTransaction, {
      width: '400px',
      disableClose: false,
      data: transactionId
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('EditTransaction Dialog result:', result);
      }
    })
  }

  deleteTransaction(transactionId: string){
    const dialogRef = this.dialog.open(DeleteTransaction, {
      width: '400px',
      disableClose: false,
      data: transactionId
    });
  }

  getUserDetails(){
    return this.userDetails = {
      userId: (sessionStorage.getItem('userId') ?? ''),
      userName: (sessionStorage.getItem('userName') ?? ''),
      email: (sessionStorage.getItem('email') ?? '')
    }
  }

  prepareUserTransactions(res: ReturnResponse<TransactionInterface[] | null>){
    if(res.statusCode === 200 && Array.isArray(res.data)){
      this.transactions = res.data;
      this.categories = this.transactions.map(transaction => transaction.category);
    } else {
      this.transactions = null;
    }
  }

  loadTransactions(){
    this.isLoading = true;
    setTimeout(() => {
      this.transactionService.retrieveTransactionGet$(this.userDetails).subscribe({
        next: (res) => {
          if(res.statusCode === 200){
            console.log(res);
            this.prepareUserTransactions(res);
            this.isLoading = false;
            console.log(this.transactions);
          } else if (res.statusCode === 404){
            console.log(res.message);
          }
        },
        error: (err) => {
          console.error('Error during retrieving user data', err);
          this.toastr.errorToast('Something went wrong. Please contact admin');
        }
      })
    }, 500);
  }

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

  // retrieveUserTransactionsGet$(){
  //   this.transactionService.retrieveTransactionGet$()
  // }

}
