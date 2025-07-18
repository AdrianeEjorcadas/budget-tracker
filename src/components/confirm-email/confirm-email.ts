import { NgOptimizedImage, Location } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Toastr } from '../../reusable/toastr/toastr';
import { UserApiService } from '../../services/user-api-service';

@Component({
  selector: 'app-confirm-email',
  imports: [NgOptimizedImage],
  templateUrl: './confirm-email.html',
  styleUrl: './confirm-email.css'
})
export class ConfirmEmail implements OnInit {

  activateRoute = inject(ActivatedRoute);
  router = inject(Router);
  toastr = inject(Toastr);
  userService = inject(UserApiService);
  location = inject(Location);

  ngOnInit(): void {
    // const token = this.activateRoute.snapshot.queryParamMap.get('token') || '';
    // this.toastr.infoToast('Confirming your email address', 2000);
    const rawQuery = this.location.path(true);
    const tokenMatch = rawQuery.match(/[?&]token=([^&]+)/);
    const rawToken = tokenMatch ? tokenMatch[1].replace(/%20/g, '%2B') : '';
    const token = decodeURIComponent(rawToken);

    this.confirmEmailPut(token);
    this.redirectToLogin();
    console.log(token);
  }

  redirectToLogin(){
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 5000);
  }

  confirmEmailPut(token: string | null){
    this.userService.confirmEmailPut(token!).subscribe({
      next: (res) => {
        if(res.statusCode === 200){
          this.toastr.successToast("Email Confirmed Successfully", 2000);
        } else {
          this.toastr.errorToast(res.message || 'Confirmation Failed');
        }
      },
      error: (err) => {
        console.error('Error during registration:', err);
        this.toastr.errorToast('Something went wrong. Please try again.');
      }
    })
  }


}
