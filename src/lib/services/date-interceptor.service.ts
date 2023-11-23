import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of, tap } from "rxjs";

@Injectable({
  providedIn: 'root'
})
/**
 * This interceptor searchs within body of http responses and, if find a field's value that respects the ISO 8601 format, converts
 * the field's value in an UTC JS Date type. This is usefull using NET Core backend that serialize json's datetime in ISO 8601 format natively.
 */
export class DateInterceptor implements HttpInterceptor {
  iso8601 = /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?(([+-]\d\d:\d\d)|Z)?$/;

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if ((req instanceof HttpRequest && req.body)) {
      // this.preProcessDates(req.body);
    }
    return next.handle(req).pipe(tap(result => this.handleHttpEvent(result)));
  }

  async handle(req: HttpRequest<any>, next: HttpHandler) {

  }

  private handleHttpEvent(event: HttpEvent<any>): Observable<any> {
    if (event instanceof HttpResponse && event.body) {
      this.postProcessDates(event.body);
    }

    return of(event);
  }

  /**
   * PostProcessing Dates
   * Converting UTC to Local Date
   * Date must be in ISO 8601 format
   */
  private postProcessDates(obj: any): any {
    if (obj === null || obj === undefined) {
      return obj;
    }

    if (typeof obj !== 'object') {
      return obj;
    }

    for (const key of Object.keys(obj)) {
      const value = obj[key];

      if (this.isIso8601(value)) {
       obj[key] = new Date(value);
      } else if (typeof value === 'object') {
        this.postProcessDates(value);
      }
    }
  }

  /**
   * Checks if the value passe is in ISO8601 format (example: '2023-09-01T16:07:00Z')
   * @param value The data field to check
   * @returns true if it is in ISO8601 format otherwise false
   */
  isIso8601(value: any) {
    if (value === null || value === undefined) {
      return false;
    }
    return this.iso8601.test(value);
  }
}
