import { Component, computed, effect, inject, Inject, Injector, OnInit, signal, runInInjectionContext } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TransactionApiService } from '../../../services/transaction-api-service';
import { Toastr } from '../../../reusable/toastr/toastr';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { oneOrZeroValidator } from '../../../reusable/validators/oneOrZeroValidator';
import { TransactionType } from '../../../enums/TransactionType';
import { CategoryInterface } from '../../../models/interface/budget-tracker-interface/CategoryInterface';
import { CommonModule } from '@angular/common';
import { single } from 'rxjs';

@Component({
  selector: 'app-edit-transaction',
  imports: [ReactiveFormsModule],
  templateUrl: './edit-transaction.html',
  styleUrl: './edit-transaction.css'
})
export class EditTransaction implements OnInit {

  private toastr = inject(Toastr);
  private injector = inject(Injector);
  private readonly transactionService = inject(TransactionApiService);

  // data
  transactionId: string = '';
  categories$ = signal<CategoryInterface[]>([]);
  categoryId = signal<number | null>(null);

  // forms
  editTransactionForm! : FormGroup;
  private formBuilder = inject(FormBuilder);

  transactionType = Object.values(TransactionType)
      .filter(key => isNaN(Number(key))) // keep only string keys
      .map(key => ({
        label: key as string,
        value: TransactionType[key as keyof typeof TransactionType]
      }));

  constructor(
    protected dialogRef: MatDialogRef<EditTransaction>,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) {
    this.transactionId = data;
  }

  ngOnInit(): void {
    this.initializeForm();
    this.getCategories$();
    this.getTransaction();
  }

  initializeForm(){
    this.editTransactionForm = this.formBuilder.group({
      transactionId : [this.transactionId,[Validators.required]],
      transactionType: [Validators.required, oneOrZeroValidator],
      amount: [Validators.required, Validators.min(0.01)],
      category: [Validators.required],
      description:['']
    })
  }

  getCategories$(){
    this.transactionService.retrieveCategoryGet$().subscribe({
      next: (res) => {
        if(res.statusCode === 200){
          if (res.data){
          this.categories$.set(res.data);
          console.log(this.categories$());
          } else {
            this.toastr.errorToast('No categories found');
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

  initializeFormValue(transactionValue: any ){

    this.getCategoryId(transactionValue.category);

    this.editTransactionForm.patchValue({
      transactionType: transactionValue.transactionType,
      amount: transactionValue.amount,
      // category: categoryId,
      description: transactionValue.description
    });
  }

  // get the category id from category signal to populate the drop down
  getCategoryId(category: string) {
    // effect() can only run insde constructor or inside of runInInjectionContext since it is DI
    runInInjectionContext(this.injector, () => {
      effect(() => {
        const match = this.categories$().find(cat => cat.category === category);
        if (match) {
          this.editTransactionForm.patchValue({ category: match.categoryId });
        }
      });
    });
  }

  getTransaction(){
    this.transactionService.retrieveTransactionByIdGet(this.transactionId).subscribe({
      next: (res) => {
        if (res.statusCode === 200){
          console.log(res.data);
          this.initializeFormValue(res.data);
        } else{
          this.toastr.errorToast(res.message);
        }
      },
      error: (err) => {
        console.error('Error retrieving data', err);
        this.toastr.errorToast('Something went wrong. Please try again.');
      }
    })
  }

  submit(){
    const formData = this.editTransactionForm.value;
    this.transactionService.updateTransactionPut(formData).subscribe({
      next: (res) => {
        if(res.statusCode === 200){
          this.toastr.successToast(res.message);
          this.dialogRef.close();
        } else {
          this.toastr.errorToast(res.message);
        }
      },
      error: (err) => {
        console.log('Error during update', err);
        this.toastr.errorToast('Something went wrong');
      }
    })
  }

// input aest.
  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let raw = input.value;

    // Allow only digits and one decimal point
    raw = raw.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');

    // Ensure max two decimal places
    const match = raw.match(/^(\d*)(\.\d{0,2})?/);
    const cleaned = match ? `${match[1]}${match[2] || ''}` : '0.00';

    this.editTransactionForm.get('amount')?.setValue(parseFloat(cleaned) || 0, { emitEvent: false });
    input.value = cleaned;
  }

  
  onBlur() {
    const value = this.editTransactionForm.get('amount')?.value || 0;
    const formatted = value.toFixed(2); // Always show two decimals
    const inputEl = document.getElementById('amount') as HTMLInputElement;
    if (inputEl) inputEl.value = formatted;
  }




}
