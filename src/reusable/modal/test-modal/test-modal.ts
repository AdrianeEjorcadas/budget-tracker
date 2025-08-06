import { Component, OnInit } from '@angular/core';
import { MODAL_DATA } from '../modal-host/modal-data.token';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-test-modal',
  imports: [],
  templateUrl: './test-modal.html',
  styleUrl: './test-modal.css'
})
export class TestModal implements OnInit {
  constructor(@Inject(MODAL_DATA) public data : { message : string} | null){
  }

  ngOnInit() {
    console.log('Modal data:', this.data);
  }
}
