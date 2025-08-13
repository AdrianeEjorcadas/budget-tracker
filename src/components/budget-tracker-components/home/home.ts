import { Component, Inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { RouterModule } from '@angular/router';
import { UserApiService } from '../../../services/user-api-service';
import { AuthenticationTokenDetails } from '../../../models/interface/AuthenticationTokenDetails';
import { inject } from '@angular/core';
import { UserIdInterface } from '../../../models/interface/UserIdInterface';
import { Toastr } from '../../../reusable/toastr/toastr';

@Component({
  selector: 'app-home',
  imports: [RouterOutlet, RouterLink, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {

  private router =  Inject(Router);
  private userService = inject(UserApiService);
  private toastr = inject(Toastr);
  private token : AuthenticationTokenDetails = {
    authToken: '',
    refreshToken: '',
    authTokenExpiration: '',
    refreshTokenExpiration: ''
  }

  ngOnInit(): void {
    this.token = this.getAuthToken();
    this.getUserId(this.token);
  }

  openTransaction(){
    this.router.navigate(['/transaction'])
  }

  getAuthToken(){
      // return JSON.parse(sessionStorage.getItem('authToken') || 'null');
      return this.token = {
        authToken: (sessionStorage.getItem('authToken') ?? ''),
        refreshToken: (sessionStorage.getItem('refreshToken') ?? ''),
        authTokenExpiration: (sessionStorage.getItem('authTokenExpiration') ?? ''),
        refreshTokenExpiration: (sessionStorage.getItem('refreshTokenExpiration') ?? '')
      }
    }
  
    // get user details by auth token
    getUserId(authToken: AuthenticationTokenDetails){
      // console.log(authToken);
      this.userService.getUserDetailsPost(authToken).subscribe({
        next: (res) => {
          if(res.statusCode === 200){
            console.log(res);
            // const userDetails = res.data as UserIdInterface;
  
            // const userDetails = res.data;
            sessionStorage.setItem('userId', res.data?.userId ?? '');
            sessionStorage.setItem('userName', res.data?.userName ?? '');
            sessionStorage.setItem('email', res.data?.email ?? '');
          } else if (res.statusCode === 404){
            console.log('No item found');        }
        },
        error: (err) => {
          console.error('Error during retrieving user data', err);
          this.toastr.errorToast('Something went wrong. Please contact admin');
        }
      })
    }
}
