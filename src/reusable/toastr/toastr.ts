import { Injectable, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class Toastr {

  private toast = inject(ToastrService);
  
  constructor() { }

  successToast(message: string){
    this.toast.success(`${message}!`, 'Budget Tracker', {
      timeOut: 1500,
      progressBar: true,
      progressAnimation: 'increasing',
      easeTime: 300
    })
  }

  infoToast(message: string){
    this.toast.info(`${message}!`, 'Budget Tracker', {
      timeOut: 1500,
      progressBar: true,
      progressAnimation: 'increasing',
      easeTime: 300
    })
  }

  warningToast(message: string){
    this.toast.warning(`${message}!`, 'Budget Tracker', {
      timeOut: 1500,
      progressBar: true,
      progressAnimation: 'increasing',
      easeTime: 300
    })
  }

   errorToast(message: string){
    this.toast.error(`${message}!`, 'Budget Tracker', {
      timeOut: 1500,
      progressBar: true,
      progressAnimation: 'increasing',
      easeTime: 300
    })
  }
}
