import { Component, inject, OnInit } from '@angular/core';
import { MODAL_DATA } from '../modal-host/modal-data.token';
import { Inject } from '@angular/core';
import { ModalService } from '../../../services/modal-service';

@Component({
  selector: 'app-test-modal',
  imports: [],
  templateUrl: './test-modal.html',
  styleUrl: './test-modal.css'
})
export class TestModal implements OnInit {

  private readonly modalService = inject(ModalService);

  constructor(@Inject(MODAL_DATA) public data : { message : string} | null){
  }

  ngOnInit() {
    console.log('Modal data:', this.data?.message);
  }

  close(){
    this.modalService.close();
  }

}
