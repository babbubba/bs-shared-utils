import { ModalMessageButton } from "./modal-message-button.interface";

export class ModalMessage{
  constructor( message: string, title: string = 'Info', okButtonLabel: string = 'Ok', okButtonClass: string= 'btn btn-primary', modalClass: string | undefined = undefined) {
      this.message = message;
      this.title = title;
      this.okButton = {
          label: okButtonLabel,
          visible: true,
          class: okButtonClass
      }
      this.modalClass = modalClass;
      this.useHtml = false;
  }
  title: string;
  message: string;
  okButton: ModalMessageButton;
  modalClass: string | undefined;
  useHtml: boolean | undefined;

}


