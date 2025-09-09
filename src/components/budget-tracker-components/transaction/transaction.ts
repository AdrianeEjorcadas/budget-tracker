import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
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
import { finalize } from 'rxjs';
import { CategoryInterface } from '../../../models/interface/budget-tracker-interface/CategoryInterface';

@Component({
  selector: 'app-transaction',
  imports: [MatDialogModule],
  templateUrl: './transaction.html',
  styleUrl: './transaction.css',
  changeDetection: ChangeDetectionStrategy.OnPush
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

  // data
  categories: string[] = []; // for testing
  // protected categories$ = signal<CategoryInterface[]>([]);
  protected isLoading = signal(true);
  protected transactions: TransactionInterface[] | null = null;
  protected transactionsSignal$ = signal<TransactionInterface[]>([]);
  // protected categories$ = signal<CategoryInterface[]>([]);

  ngOnInit(): void {
    // this.token = this.getAuthToken();
    // this.getUserId(this.token);
    this.getUserDetails();
    this.loadTransactions();
  }

  addTransaction(){
    const dialogRef = this.dialog.open(AddTransaction, {
      width: '400px',
      disableClose: true,
      data: this.categories 
    });

    dialogRef.afterClosed().subscribe( result => {
          console.log("after close:", result);
        if(result){
          console.log("Old value transactionsSignal$:", this.transactionsSignal$());
          console.log("Add Transaction result:", result);
          this.transactionsSignal$.update(list => [...list, result.data]);
          console.log("New value transactionsSignal$:", this.transactionsSignal$());
        }
    });
  }

  editTransaction(transactionId: string) {
    const dialogRef = this.dialog.open(EditTransaction, {
      width: '400px',
      disableClose: false,
      data: {
        transactionId: transactionId,
        transactions: this.transactionsSignal$() // snapshot
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        result.transactionType = Number(result.transactionType);

        this.transactionsSignal$.update(list =>
          list.map(tx =>
            tx.transactionId === result.transactionId
              ? result // replace with updated transaction
              : tx
          )
        );
        console.log('EditTransaction Dialog result:', result);
      }
    });
  }

  deleteTransaction(transactionId: string){
    const dialogRef = this.dialog.open(DeleteTransaction, {
      width: '400px',
      disableClose: false,
      data: transactionId
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.transactionsSignal$.update(list => 
          list.map(tx => 
            tx.transactionId === transactionId
              ? { ...tx, isDeleted: true }
              : tx
          ).filter(tx => !tx.isDeleted)
        )
      }
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
      // this.transactions = res.data;
      // this.categories = this.transactions.map(transaction => transaction.category);
      this.transactionsSignal$.set(res.data.filter(t => !t.isDeleted));
      console.log("signal " , this.transactionsSignal$());
      // this.categories = this.transactionsSignal$().map(transaction => transaction.category);
      // console.log("categories:", this.categories);
    } else {
      this.transactions = null;
    }
  }

  loadTransactions(){
    this.isLoading.set(true);
      this.transactionService.retrieveTransactionGet$(this.userDetails)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (res) => {
          if(res.statusCode === 200){
            console.log(res);
            this.prepareUserTransactions(res);
            console.log(this.transactionsSignal$());
            console.log(this.isLoading);
          } else if (res.statusCode === 404){
            console.log(res.message);
          }
        },
        error: (err) => {
          console.error('Error during retrieving user data', err);
          this.toastr.errorToast('Something went wrong. Please contact admin');
        }
      });
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
