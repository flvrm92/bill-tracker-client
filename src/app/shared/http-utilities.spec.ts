import { HttpErrorResponse } from '@angular/common/http';
import { handleHttpError, logAndHandleHttpError, logAndThrowHttpError } from './http-utilities';

describe('HTTP Utilities', () => {
  let consoleGroupSpy: jasmine.Spy;
  let consoleInfoSpy: jasmine.Spy;
  let consoleErrorSpy: jasmine.Spy;
  let consoleGroupEndSpy: jasmine.Spy;

  beforeEach(() => {
    consoleGroupSpy = spyOn(console, 'group');
    consoleInfoSpy = spyOn(console, 'info');
    consoleErrorSpy = spyOn(console, 'error');
    consoleGroupEndSpy = spyOn(console, 'groupEnd');
  });

  describe('handleHttpError', () => {
    it('should return default value when error occurs', (done) => {
      const defaultValue = { data: 'default' };
      const error = new HttpErrorResponse({ status: 404, statusText: 'Not Found' });

      const errorHandler = handleHttpError(defaultValue);
      const result$ = errorHandler(error);

      result$.subscribe(result => {
        expect(result).toEqual(defaultValue);
        done();
      });
    });

    it('should handle different default value types', (done) => {
      const defaultValue: any[] = [];
      const error = new HttpErrorResponse({ status: 500 });

      const errorHandler = handleHttpError(defaultValue);
      const result$ = errorHandler(error);

      result$.subscribe(result => {
        expect(result).toEqual([]);
        done();
      });
    });
  });

  describe('logAndHandleHttpError', () => {
    it('should log error and return default value', (done) => {
      const operationName = 'fetchUsers';
      const defaultValue = { users: [] };
      const error = new HttpErrorResponse({ 
        status: 404, 
        statusText: 'Not Found',
        error: 'Resource not found'
      });

      const errorHandler = logAndHandleHttpError(operationName, defaultValue);
      const result$ = errorHandler(error);

      result$.subscribe(result => {
        expect(result).toEqual(defaultValue);
        expect(consoleGroupSpy).toHaveBeenCalledWith('HTTP Error');
        expect(consoleInfoSpy).toHaveBeenCalledWith(`${operationName} has failed!`);
        expect(consoleErrorSpy).toHaveBeenCalledWith(error);
        expect(consoleGroupEndSpy).toHaveBeenCalled();
        done();
      });
    });

    it('should log error with operation name containing spaces', (done) => {
      const operationName = 'fetch user data';
      const defaultValue = null;
      const error = new HttpErrorResponse({ status: 500 });

      const errorHandler = logAndHandleHttpError(operationName, defaultValue);
      const result$ = errorHandler(error);

      result$.subscribe(result => {
        expect(result).toBe(null);
        expect(consoleInfoSpy).toHaveBeenCalledWith('fetch user data has failed!');
        done();
      });
    });
  });

  describe('logAndThrowHttpError', () => {
    it('should log error and throw it', (done) => {
      const operationName = 'deleteUser';
      const error = new HttpErrorResponse({ 
        status: 403, 
        statusText: 'Forbidden',
        error: 'Access denied'
      });

      const errorHandler = logAndThrowHttpError(operationName);
      const result$ = errorHandler(error);

      result$.subscribe({
        error: (err) => {
          expect(err).toBe(error);
          expect(consoleGroupSpy).toHaveBeenCalledWith('HTTP Error');
          expect(consoleInfoSpy).toHaveBeenCalledWith(`${operationName} has failed!`);
          expect(consoleErrorSpy).toHaveBeenCalledWith(error);
          expect(consoleGroupEndSpy).toHaveBeenCalled();
          done();
        }
      });
    });

    it('should rethrow different error types', (done) => {
      const operationName = 'updateRecord';
      const error = new HttpErrorResponse({ 
        status: 400,
        statusText: 'Bad Request',
        error: { message: 'Invalid data' }
      });

      const errorHandler = logAndThrowHttpError<any>(operationName);
      const result$ = errorHandler(error);

      result$.subscribe({
        error: (err) => {
          expect(err.status).toBe(400);
          expect(err.statusText).toBe('Bad Request');
          done();
        }
      });
    });
  });
});
