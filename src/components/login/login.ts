import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { LoginInterface } from '../../models/interface/LoginInterface';
import { ReturnResponse } from '../../models/return-response';
import { CommonModule, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgOptimizedImage],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router:Router
  ){
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    })
  }

  public onLogin(){
    console.log(this.loginForm.valid, this.loginForm.value, this.loginForm.errors);
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
