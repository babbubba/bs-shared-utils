
import {  Component, EventEmitter,  Input, OnInit,  Output} from  '@angular/core';
import { ModalConfirm } from '../../models';

@Component({

  selector:    'BSConfirmModal',
  templateUrl:    './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.less']
})

export class  ConfirmModalComponent  implements OnInit {
  @Input()  model!: ModalConfirm;
  @Output()  event: EventEmitter<boolean | undefined> =    new EventEmitter();

  constructor() { }

  ngOnInit():  void {
  }

  cancel() {
    this.event.emit(undefined);
  }

  ok() {
    this.event.emit(true);
  }

  no() {
    this.event.emit(false);
  }
}
