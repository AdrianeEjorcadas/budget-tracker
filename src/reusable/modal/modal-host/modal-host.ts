import { Component, inject, Injector } from '@angular/core';
import { ModalService } from '../../../services/modal-service';
import { CommonModule, NgComponentOutlet } from '@angular/common';
import { MODAL_DATA } from './modal-data.token';

@Component({
  selector: 'app-modal-host',
  imports: [NgComponentOutlet, CommonModule],
  templateUrl: './modal-host.html',
  styleUrl: './modal-host.css'
})
export class ModalHost {
  readonly modalComponent = inject(ModalService).getComponent;
  readonly modalData = inject(ModalService).getData;
  readonly parentInjector = inject(Injector);

  get modalInjector() {
    return Injector.create({
      providers: [
        { provide: MODAL_DATA, useValue: this.modalData() }
      ],
      parent: this.parentInjector
    });
  }
}
