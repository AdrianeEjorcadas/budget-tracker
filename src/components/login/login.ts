import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { LoginInterface } from '../../models/interface/LoginInterface';
import { ReturnResponse } from '../../models/return-response';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { UserApiService } from '../../services/user-api-service';
import { Toastr } from '../../reusable/toastr/toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgOptimizedImage],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  loginForm: FormGroup;
  private userService = inject(UserApiService);
  private toastr = inject(Toastr);
  constructor(
    private fb: FormBuilder,
    private router:Router
  ){
    this.loginForm = this.fb.group({
      EmailAddress: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    })
  }
  onLogin(){
    if(this.loginForm.invalid) return;
    const userCreds = this.loginForm.value;

    this.userService.loginUserPost(userCreds).subscribe({
      next: (res) => {
        if(res.statusCode === 200){
          const authToken = res.data?.token?.authToken;
          const refreshToken = res.data?.token.refreshToken;
          const authTokenExpiration = res.data?.token.authTokenExpiration;
          const refreshTokenExpiration = res.data?.token.refreshTokenExpiration;

          this.storeAccess(authToken!, refreshToken!, authTokenExpiration!, refreshTokenExpiration!);
          console.log(res);
          this.toastr.successToast("Successfully Login");
          this.loginForm.reset();
          // reroute to homepage
          // this.router.navigate(['/home'], {replaceUrl: true});
          this.openHome();
        } else {
            this.toastr.errorToast(res.message || 'Incorrect username or password');
          }
        },
      error: (error : any) =>{
        console.error('Error during login:', error?.error || error?.message || error);
        this.toastr.errorToast('Something went wrong. Please try again.');
      }
    })
  }

  storeAccess(authToken: string, refreshToken: string, authExp: string, refreshExp: string): void{
    sessionStorage.setItem('authToken', authToken);
    sessionStorage.setItem('refreshToken', refreshToken);
    sessionStorage.setItem('authTokenExpiration', authExp);
    sessionStorage.setItem('refreshTokenExpiration', refreshExp);
  }

  openHome():void{
      setTimeout(() => {
        this.router.navigate(['/home'], { replaceUrl: true });
      }, 0);
  }

  openRegister(): void{
    this.router.navigate(['/register']);
  }

  openForgotPassword() : void{
    this.router.navigate(['/forgot-password']);
  }

  debugClick() {
    alert('test');
  }   
}
