import { Injectable } from '@angular/core';
import { ModalConfirm, ModalMessage } from '../models';
import { Observable, of, tap } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmModalComponent, MessageModalComponent } from '../../public-api';
import { BsModalService } from 'ngx-bootstrap/modal';

@Injectable({
  providedIn: 'root'
})
export class ModalMessagesService {

  constructor(
    private modalService: BsModalService,
    private translate: TranslateService
  ) { }

  /**

   * Open a modal confirm and return Observable to manage the response

   * @param
  {ModalConfirm}
  model

   * @returns
  {Observable<boolean|undefined>|undefined}

   */
  confirmMessage(model: string | ModalConfirm): Observable<boolean | undefined> {
    var input: ModalConfirm;
    if ('string' === typeof (model)) {
      input = new ModalConfirm(model);

      this.translate.get('commons.titles.confirm').subscribe((res: string) => {
        input.title = res;
      });
      this.translate.get('commons.buttons.ok').subscribe((res: string) => {
        input.okButton.label = res;
      });
      this.translate.get('commons.buttons.no').subscribe((res: string) => {
        input.noButton.label = res;
      });
      this.translate.get('commons.buttons.cancel').subscribe((res: string) => {
        input.cancelButton.label = res;
      });
    }
    else {
      input = model;
    }

    const initialState = { model: input };

    const modal = this.modalService.show(ConfirmModalComponent, { initialState: initialState });

    return modal.content?.event.pipe(
      tap(modal.hide)
    ) ?? of(undefined);

  }


  infoMessage(message: string): Observable<void> | undefined {
    var input: ModalMessage = new ModalMessage(message, this.translate.instant('commons.titles.info'), undefined, undefined, 'bg-info');

    return this.showMessage(input);
  }

  warningMessage(message: string, useHtml: boolean = false) {
    var input: ModalMessage = new ModalMessage(message, this.translate.instant('commons.titles.warning'), undefined, undefined, 'bg-warning');
    input.useHtml = useHtml;
    return this.showMessage(input);
  }

  errorMessage(message: string) {
    var input: ModalMessage = new ModalMessage(message, this.translate.instant('commons.titles.error'), undefined, undefined, 'bg-danger');
    return this.showMessage(input);
  }

  showMessage(input: ModalMessage): Observable<void> | undefined {
    const
      initialState = {
        model: input
      }

    const
      modal = this.modalService.show(MessageModalComponent, { initialState: initialState });

    return modal.content?.event.pipe(
      tap(modal.hide)
    );
  }

}
