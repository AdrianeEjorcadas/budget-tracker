import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidatorFn, ValidationErrors  } from '@angular/forms';
import { timeout } from 'rxjs';
import { Toastr } from '../../reusable/toastr/toastr';


@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule,NgOptimizedImage],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register implements OnInit {

  registerForm!: FormGroup;
  private fb = inject(FormBuilder);
  private toastr = inject(Toastr);

 private passwordMatchValidator: ValidatorFn = (form: AbstractControl): ValidationErrors | null => {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  };
  private uppercaseValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null =>
      /[A-Z]/.test(control.value) ? null : { uppercase: true };
  }

  private numberValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null =>
      /\d/.test(control.value) ? null : { number: true };
  }

  private specialCharValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null =>
      /[!@#$%^&*()_,.?":{}|<>]/.test(control.value) ? null : { specialChar: true };
  }
  
  ngOnInit(): void {
    this.createFormRegisterForm();
  }

  createFormRegisterForm(){
    this.registerForm = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
      [
        Validators.required, 
        Validators.minLength(8), 
        this.uppercaseValidator(), 
        this.numberValidator(), 
        this.specialCharValidator()
      ]
    ], 
      confirmPassword: ['', [Validators.required]]
    },
    { validators: this.passwordMatchValidator }
  );
  }

  protected debugClickres() {
    alert('test');
  }   


  onRegister(){
    console.log(this.registerForm.value);
    // this.showToast('Successfully Register', 'Budget Tracker');
    this.toastr.successToast('Successfully Register');
    this.formReset();
  }

  formReset(){
    this.registerForm.reset();
  }

  // showToast(message: string, title: string) {
  //   this.toast.success(`${message}`, title, {timeOut: 2000, progressBar: true, progressAnimation:'increasing' , easeTime: 300} );
  // }


}
