import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorsService {

  constructor(private router: Router) { }

  goToBrokenPage() {
    this.router.navigate(['/shared/broken']);
  }



}

export function handleError(error: any): [number, string] {
  let errorStatus: number = 0;
  let errorMessage: string = '';
  if (error instanceof HttpErrorResponse) {

    console.error(`Error - [Status Code: ${error.status}] ${error.message}`);
    errorStatus = error.status;
    errorMessage = error.message;
  }
  else if (error.error instanceof ErrorEvent) {
    let err = <ErrorEvent>error;
    console.error(`Event error - ${err.message}`);
    errorMessage = err.message;
  }
  else {
    console.error(`Unhandled error - ${error}`);
    errorMessage = JSON.stringify(error);
  }

  return [errorStatus, errorMessage];
}

export function pipeError<T>(source: Observable<T>): Observable<T> {
  return source.pipe(
    catchError((err, caught) => {
      let resErr = handleError(err);
      return of();
    }
    ));
}

export function pipeThrowError<T>(source: Observable<T>): Observable<T> {
  return source.pipe(
    catchError((err, caught) => {
      let resErr = handleError(err);
      return throwError(() => new Error(resErr[1]));
    }
    ));
}
