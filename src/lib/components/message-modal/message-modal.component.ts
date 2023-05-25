import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalMessage } from '../../models';

@Component({
  selector: 'BsMessageModal',
  templateUrl: './message-modal.component.html',
  styleUrls: ['./message-modal.component.less']
})
export class MessageModalComponent implements OnInit {

  @Input() model!:  ModalMessage;
  @Output() event: EventEmitter<void> = new EventEmitter();


  constructor() {

  }

  ngOnInit(): void {
  }


  ok(){
    this.event.emit();
  }

}
