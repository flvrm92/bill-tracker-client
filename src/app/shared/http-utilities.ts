import { HttpErrorResponse } from "@angular/common/http";
import { Observable, of, throwError } from "rxjs";

export function handleHttpError<T>(result: T) {
  return (error: HttpErrorResponse): Observable<T> => {
    return of(result);
  };
}

export function logAndHandleHttpError<T>(operationName: string, result: T) {
  return (error: HttpErrorResponse): Observable<T> => {
    logError(operationName, error);
    return of(result);
  };
}

export function logAndThrowHttpError<T>(operationName: string) {
  return (error: HttpErrorResponse): Observable<T> => {
    logError(operationName, error);
    return throwError(() => error);
  };
}

function logError(operation: String, error: HttpErrorResponse) {
  console.group('HTTP Error');
  console.info(`${operation} has failed!`);
  console.error(error);
  console.groupEnd();
}