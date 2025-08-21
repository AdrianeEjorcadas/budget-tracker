import { Component, inject } from '@angular/core';
import { Inject } from '@angular/core';
import { MODAL_DATA } from '../../../reusable/modal/modal-host/modal-data.token';
import { ModalService } from '../../../services/modal-service';
import { AddTransactionInterface } from '../../../models/interface/AddTransactionInterface';

@Component({
  selector: 'app-add-transaction',
  imports: [],
  templateUrl: './add-transaction.html',
  styleUrl: './add-transaction.css'
})
export class AddTransaction {

  private readonly modalService = inject(ModalService);

  close(){
    this.modalService.close();
  }

}
