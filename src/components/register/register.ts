import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidatorFn, ValidationErrors , AsyncValidatorFn } from '@angular/forms';
import { catchError, debounceTime, filter, map, Observable, of, switchMap, timeout, timer } from 'rxjs';
import { Toastr } from '../../reusable/toastr/toastr';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { UserApiService } from '../../services/user-api-service';
import { ReturnResponse } from '../../models/return-response';



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
  private http = inject(HttpClient);
  private userService = inject(UserApiService);

  //#region Validators
 private passwordMatchValidator: ValidatorFn = (form: AbstractControl): ValidationErrors | null => {
    const password = form.get('password')?.value;
    const confirmationPassword = form.get('confirmationPassword')?.value;
    return password === confirmationPassword ? null : { passwordMismatch: true };
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

  private emailExistValidator() : AsyncValidatorFn{
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value || control.invalid) return of(null);
      return timer(300).pipe(
        // filter(() => !!control.value && !!this.registerForm.get('email')?.valid),
        switchMap(() =>
          this.userService.isEmailExist(control.value).pipe(
            map(res => res.data ? {emailTaken: true} : null ),
            catchError(() => of(null))
          )
        )
      );
    }
  }
  
  //#endregion

  ngOnInit(): void {
    this.createFormRegisterForm();
    this.isEmailExist();
  }

  createFormRegisterForm(){
    this.registerForm = this.fb.group({
      username: ['', [Validators.required]],
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
      confirmationPassword: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email], [this.emailExistValidator()]],
    },
    { validators: this.passwordMatchValidator }
  );
  }

  isEmailExist(){
    this.registerForm.get('email')?.valueChanges
    .pipe(
      debounceTime(300),
      filter((email: string) => !!email && !!this.registerForm.get('email')?.valid),
      switchMap(email => this.userService.isEmailExist(email))
      )
    .subscribe(result =>{
      if(result.data){
        console.log('Email exists!');
        this.registerForm.get('email')?.setErrors({emailTaken: true})
      } else {
        console.log('Email is available');
        this.registerForm.get('email')?.setErrors({emailTaken: false});
      }
    })
  }

  protected debugClickres() {
    alert('test');
  }   


  onRegister(){
    console.log(this.registerForm.value);
    const formData = this.registerForm.value;
    // this.showToast('Successfully Register', 'Budget Tracker');
    this.userService.registerUserPost(formData).subscribe({
      next: (res) =>{
        if(res.statusCode === 201){
          this.toastr.successToast('Successfully Registered')
          this.formReset();
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

  formReset(){
    this.registerForm.reset();
  }

  // showToast(message: string, title: string) {
  //   this.toast.success(`${message}`, title, {timeOut: 2000, progressBar: true, progressAnimation:'increasing' , easeTime: 300} );
  // }


}
