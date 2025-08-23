import { Component, inject, OnInit } from '@angular/core';
import { Inject } from '@angular/core';
import { MODAL_DATA } from '../../../reusable/modal/modal-host/modal-data.token';
import { ModalService } from '../../../services/modal-service';
import { AddTransactionInterface } from '../../../models/interface/AddTransactionInterface';
import { TransactionApiService } from '../../../services/transaction-api-service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { oneOrZeroValidator } from '../../../reusable/validators/oneOrZeroValidator';
import { TransactionType } from '../../../enums/TransactionType';
import { CommonModule } from '@angular/common';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { DialogRef } from '@angular/cdk/dialog';


@Component({
  selector: 'app-add-transaction',
  imports: [ReactiveFormsModule, CommonModule, MatDialogModule, MatFormFieldModule, MatInputModule],
  standalone: true,
  templateUrl: './add-transaction.html',
  styleUrl: './add-transaction.css'
})
export class AddTransaction implements OnInit{

  private readonly modalService = inject(ModalService);
  private transactionService = inject(TransactionApiService);

  

  transactionType = Object.values(TransactionType)
    .filter(key => isNaN(Number(key))) // keep only string keys
    .map(key => ({
      label: key as string,
      value: TransactionType[key as keyof typeof TransactionType]
    }));

  //forms
  addTransactionForm!: FormGroup;
  private formBuilder = inject(FormBuilder);
  
  //modal
  dialogRef = inject(DialogRef<AddTransaction>);

  close(){
    this.modalService.close();
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(){
    this.addTransactionForm = this.formBuilder.group({
      transactionType: [0, [Validators.required, oneOrZeroValidator]],
      amount: [0, [Validators.required, Validators.min(0.01)]],
      category: ['', Validators.required],
      description: ['']
    });
  }

  submit(){
    if (this.addTransactionForm.valid) {
      console.log('Form submitted:', this.addTransactionForm.value);
    } else {
      this.addTransactionForm.markAllAsTouched();
    }

  }

  ngAfterViewInit() {
  console.log(this.addTransactionForm.get('category'));
}


}
