import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Toastr } from '../../reusable/toastr/toastr';
import { UserApiService } from '../../services/user-api-service';

@Component({
  selector: 'app-forgot-password',
  imports: [CommonModule, ReactiveFormsModule, NgOptimizedImage],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css'
})
export class ForgotPassword implements OnInit {
  forgotPasswordForm!: FormGroup;

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private toastr = inject(Toastr);
  private userService = inject(UserApiService);
  protected isSubmitting = false;

  ngOnInit(): void {
    this.createForm();
  }

  createForm(){
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void{ 
     if (this.forgotPasswordForm.valid) {
      const email = this.forgotPasswordForm.value.email;

      this.toastr.infoToast(`Sent email confirmation to ${email}`);
      this.forgotPasswordForm.reset();
      
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
    }
  }

  onForgotPassword(){
    if(this.forgotPasswordForm.invalid) return;

    this.isSubmitting = true;
    const email = {EmailAddress : this.forgotPasswordForm.value.email};

    this.userService.forgotPasswordPost(email).subscribe({
      next: (res) => {
        if(res.statusCode === 200){
          this.toastr.successToast(`Sent email confirmation to ${email}`);
          this.forgotPasswordForm.reset();
          this.rerouteToLogin();
        } else {
          this.toastr.errorToast(res.message || 'Reset Failed');
        }
      },
      error: (err) => {
        console.error('Error during reset:', err);
        this.toastr.errorToast('Something went wrong. Please try again.');
      }
    })
  }

  rerouteToLogin(){
    setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
  }

  debugClick() {
      const email = this.forgotPasswordForm.value.email;
      this.toastr.infoToast(`Sent email confirmation to ${email}`);
  }   
}
