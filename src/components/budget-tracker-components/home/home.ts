import { Component, Inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterOutlet, RouterLink, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

  private router =  Inject(Router);

  openTransaction(){
    this.router.navigate(['/transaction'])
  }
}
