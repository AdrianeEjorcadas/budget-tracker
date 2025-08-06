import { Component, inject } from '@angular/core';
import { ModalService } from '../../../services/modal-service';
import { TestModal } from '../../../reusable/modal/test-modal/test-modal';
import { ModalHost } from '../../../reusable/modal/modal-host/modal-host';

@Component({
  selector: 'app-transaction',
  imports: [ModalHost],
  templateUrl: './transaction.html',
  styleUrl: './transaction.css'
})
export class Transaction {

  private modal = inject(ModalService);

  openTest(){
    this.modal.open(TestModal, { message: 'Open Modal'});
  }
}
