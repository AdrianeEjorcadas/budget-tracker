import { Component, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  imports: [NgOptimizedImage],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css'
})
export class LandingPage {

  private router = inject(Router);

  openLogIn(){
    this.router.navigate(['/login']);
  }

  openRegister(){
    this.router.navigate(['/register']);
  }
}
