// modal.service.ts

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  // Add properties to store modal data
  isModalOpen = false;
  modalData: any;

  openModal(data: any) {
    this.isModalOpen = true;
    this.modalData = data;
  }

  closeModal() {
    this.isModalOpen = false;
    this.modalData = null;
  }
}
