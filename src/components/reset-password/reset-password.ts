import { CommonModule, NgOptimizedImage, Location } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Toastr } from '../../reusable/toastr/toastr';
import { UserApiService } from '../../services/user-api-service';
import { ResetPasswordInterface } from '../../models/interface/ResetPasswordInterface';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule, NgOptimizedImage, CommonModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css'
})
export class ResetPassword implements OnInit{
  resetForm!: FormGroup;
  private fb = inject(FormBuilder);
  private activeRoute = inject(ActivatedRoute);
  private toastr = inject(Toastr);
  private userService = inject(UserApiService);
  private router = inject(Router);
  private location = inject(Location);
  token : string | null = null;

  private passwordMatchValidator: ValidatorFn = (form: AbstractControl): ValidationErrors | null => {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
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
    const rawQuery = this.location.path(true);
    const tokenMatch = rawQuery.match(/[?&]token=([^&]+)/);
    const rawToken = tokenMatch ? tokenMatch[1].replace(/%20/g, '%2B') : '';
    this.token =  decodeURIComponent(rawToken);
    this.createResetForm();
  }

  createResetForm(){
    this.resetForm = this.fb.group({
      newPassword: [
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
      {validators: this.passwordMatchValidator}
    );
  }

  resetPasswordPut(token: string | null){
    if(!token){
      this.toastr.errorToast('Token not found');
      return;
    }

    this.userService.resetPasswordPut(token, this.resetForm.value).subscribe({
      next: (res) => {
        if(res.statusCode === 200){
          this.toastr.successToast(res.message);
          this.clearForm();
          this.redirectToLogin();
        } else if(res.statusCode === 401) {
          this.toastr.errorToast('Unauthorized access. Please try again.');
        } else {
          this.toastr.errorToast(res.message || 'Password Reset Failed');
        }
      },
      error: (err) => {
        console.error('Error during password reset', err);
        this.toastr.errorToast('Something went wrong. Please try again');
      }
    })
  }

  clearForm(){
    this.resetForm.reset();
  }

  redirectToLogin(){
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 5000);
  }

  onSubmit(){
    this.resetPasswordPut(this.token);
  }

}
