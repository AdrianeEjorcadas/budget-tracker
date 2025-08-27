import { Component, inject, OnInit, signal } from '@angular/core';
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
import { Toastr } from '../../../reusable/toastr/toastr';
import { CategoryInterface } from '../../../models/interface/budget-tracker-interface/CategoryInterface';


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
  private toastr = inject(Toastr);
  

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

  //data
  formattedAmount: string = '';
  categories$ = signal<CategoryInterface[]>([]);
  

  close(){
    this.modalService.close();
  }

  ngOnInit(): void {
    this.initializeForm();
    this.getCategories$();
  }

  initializeForm(){
    this.addTransactionForm = this.formBuilder.group({
      userId: [sessionStorage.getItem('userId')],
      transactionType: [0, [Validators.required, oneOrZeroValidator]],
      amount: [0, [Validators.required, Validators.min(0.01)]],
      category: [0, Validators.required],
      description: ['']
    });
  }

  getCategories$(){
    this.transactionService.retrieveCategoryGet$().subscribe({
      next: (res) => {
        if(res.statusCode === 200){
          if (res.data){
          this.categories$.set(res.data!);
          // console.log(this.categories$());
          } else {
            this.toastr.errorToast('No categories found');
            this.close();
          }
        } else{
          this.toastr.errorToast(res.message);
        }
      },
      error: (err) => {
        console.error('Error during registration:', err);
        this.toastr.errorToast('Something went wrong. Please try again.');
      }
    })
  }

  submit(){
    const formData: AddTransactionInterface = this.addTransactionForm.value;
    this.transactionService.addTransactionPost(formData).subscribe({
      next: (res) => {
        if(res.statusCode === 201){
          this.toastr.successToast('Successfully added');
          this.dialogRef.close();
        } else {
          this.toastr.errorToast(res.message || 'Registration Failed')
        }
      },
      error: (err) => {
        console.error('Error during registration:', err);
        this.toastr.errorToast('Something went wrong. Please try again.');
      }
    })
  }

  

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let raw = input.value;

    // Allow only digits and one decimal point
    raw = raw.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');

    // Ensure max two decimal places
    const match = raw.match(/^(\d*)(\.\d{0,2})?/);
    const cleaned = match ? `${match[1]}${match[2] || ''}` : '0.00';

    this.addTransactionForm.get('amount')?.setValue(parseFloat(cleaned) || 0, { emitEvent: false });
    input.value = cleaned;
  }

  
  onBlur() {
    const value = this.addTransactionForm.get('amount')?.value || 0;
    const formatted = value.toFixed(2); // Always show two decimals
    const inputEl = document.getElementById('amount') as HTMLInputElement;
    if (inputEl) inputEl.value = formatted;
  }


  ngAfterViewInit() {
  console.log(this.addTransactionForm.get('category'));
}


}
