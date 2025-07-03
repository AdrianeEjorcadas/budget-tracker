import { Injectable, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class Toastr {

  private toast = inject(ToastrService);
  
  constructor() { }

  successToast(message: string, timeDuration: number = 1500){
    this.toast.success(`${message}!`, 'Budget Tracker', {
      timeOut: timeDuration,
      progressBar: true,
      progressAnimation: 'increasing',
      easeTime: 300
    })
  }

  infoToast(message: string, timeDuration: number = 1500){
    this.toast.info(`${message}!`, 'Budget Tracker', {
      timeOut: timeDuration,
      progressBar: true,
      progressAnimation: 'increasing',
      easeTime: 300
    })
  }

  warningToast(message: string, timeDuration: number = 1500){
    this.toast.warning(`${message}!`, 'Budget Tracker', {
      timeOut: timeDuration,
      progressBar: true,
      progressAnimation: 'increasing',
      easeTime: 300
    })
  }

   errorToast(message: string, timeDuration: number = 1500){
    this.toast.error(`${message}!`, 'Budget Tracker', {
      timeOut: timeDuration,
      progressBar: true,
      progressAnimation: 'increasing',
      easeTime: 300
    })
  }
}
