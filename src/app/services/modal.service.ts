// modal.service.ts

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private modalStateSource = new Subject<boolean>();
  public modalState$ = this.modalStateSource.asObservable();

  constructor() {}

  public openModal() {
    this.modalStateSource.next(true);
  }

  public closeModal() {
    this.modalStateSource.next(false);
  }
}
