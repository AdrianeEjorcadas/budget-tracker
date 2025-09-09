import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TransactionApiService } from '../../../services/transaction-api-service';
import { Toastr } from '../../../reusable/toastr/toastr';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-delete-transaction',
  imports: [],
  templateUrl: './delete-transaction.html',
  styleUrl: './delete-transaction.css'
})
export class DeleteTransaction {

  //services
  transactionService = inject(TransactionApiService);
  toastr = inject(Toastr);

  //data
  transactionId: string = '';

  constructor(
    protected dialogRef: MatDialogRef<DeleteTransaction>,
    @Inject(MAT_DIALOG_DATA) public data : string
  ){
    this.transactionId = data;
  }

  submit(){
    console.log(this.transactionId);
    this.transactionService.DeleteTransaction(this.transactionId)
    .pipe(finalize (()=>{
      this.dialogRef.close(true);
      })
    )
    .subscribe({
      next: (res) =>{
        if (res.statusCode === 200){
          this.toastr.successToast('Transaction Successfully Deleted!');
        } else{
          this.toastr.errorToast(res.message);
        }
      },
      error: (err) =>{
        this.toastr.errorToast(err.message);
      }
    });
    
  }

}
