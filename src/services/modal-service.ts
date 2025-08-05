import { computed, Injectable, signal } from '@angular/core';
import { ComponentType } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private component = signal<ComponentType<any> | null>(null);
  private data = signal<any>(null);
  

  open<T>(component: ComponentType<T>, data?:any){
    this.component.set(component);
    this.data.set(data);
  }

  close(){
    this.component.set(null);
    this.data.set(null);
  }

  // getters
  getComponent = computed(() => this.component());
  getData = computed(() => this.data());
  
}
