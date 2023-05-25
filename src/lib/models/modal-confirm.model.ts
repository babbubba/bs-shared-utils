import { ModalMessageButton } from "./modal-message-button.interface";
import { ModalMessage } from "./modal-message.model";


export class ModalConfirm extends ModalMessage {
  constructor(message: string, title: string = 'Info',
    okButtonLabel: string = 'Yes', okButtonClass: string = 'btn btn-primary',
    noButtonLabel: string = 'No', noButtonClass: string = 'btn btn-warning',
    cancelButtonLabel: string = 'Cancel', cancelButtonClass: string = 'btn btn-danger',
    modalClass: string | undefined = undefined
  ) {
    super(message, title, okButtonLabel, okButtonClass, modalClass);
    this.noButton = {
      label: noButtonLabel,
      visible: true,
      class: noButtonClass
    };
    this.cancelButton = {
      label: cancelButtonLabel,
      visible: true,
      class: cancelButtonClass
    };
  }
  noButton: ModalMessageButton;
  cancelButton: ModalMessageButton;
}
