import { IstantNotifyService } from './istant-notify.service';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, map, of, tap, throwError } from "rxjs";
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from './authentication.service';
import { ModalMessagesService } from './modal-messages.service';
import { NavigationEnd, Router } from '@angular/router';

@Injectable()
export class ErrorsInterceptor implements HttpInterceptor {
  constructor(private authService: AuthenticationService, private mms: ModalMessagesService, private translate: TranslateService, private notify: IstantNotifyService, private router: Router) { }

  private handleErrors(err: HttpErrorResponse): Observable<any> {
    switch (err.status) {
      case 0:
        {
          this.notify.error(this.translate.instant('errors.offline'), undefined);
          return of(err.message);
        }
      case 401:
        {

          this.authService.logout();
          let url = this.router.routerState.snapshot.url;
          this.authService.goToLogin(url);
          // this.router.events.subscribe((event) => {
          //   if (event) {
          //     url = event instanceof NavigationEnd ? event.url : null;
          //   }
          //   this.authService.goToLogin(url);
          // })
          return of(err.message);
        }
      case 403:
        {
          // this.mms.warningMessage(this.translate.instant('errors.permission-denied'));
          this.notify.warning(this.translate.instant('errors.permission-denied'), undefined);
          return of(err.message);
        }
      case 400:
        {
          let errors = Object.entries(err.error.errors);
          let message = `<ul>${errors.map(e => `<li key=${e[0]}> ${this.translate.instant('errors.validation-error.field')} '${e[0]}': ${e[1]} </li>`)}</ul>`;
          this.mms.warningMessage(this.translate.instant('errors.validation-error.message') + "<br />" + message, true)?.subscribe(
            r => { }
          );
          return of(err.message);
        }
    }

    return throwError(() => err);
  }

  private handleApiResponse(event: HttpEvent<any>): Observable<any> {
    if (event instanceof HttpResponse && event.body) {
      // Questo intercetta gli errori gestiti e visualizza un messaggio di errore in uan finestra modale
      if ('success' in event.body && event.body.success === false) {
        this.mms.errorMessage(event.body.errorMessage)?.subscribe(r => { });
      }
    }
    return of(event);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(tap(result => this.handleApiResponse(result)), catchError(error => this.handleErrors(error)));
  }
}
