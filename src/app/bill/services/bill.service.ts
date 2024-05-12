import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, map, retry } from "rxjs";
import { IBIllDto, IBill } from "src/app/core/models";
import { logAndHandleHttpError, logAndThrowHttpError } from "src/app/shared/http-utilities";
import { Environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class BillService {
  private readonly apiUrl = Environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAll(): Observable<IBIllDto[]> {
    return this.http.get<IBIllDto[]>(`${this.apiUrl}/bill`)
      .pipe(
        retry(2),
        catchError(logAndHandleHttpError('bill', [] as IBIllDto[]))
      )
  };

  getById(id: string): Observable<IBill> {
    return this.http.get<IBill>(`${this.apiUrl}/bill/${id}`)
      .pipe(
        retry(2),
        catchError(logAndHandleHttpError('bill', {} as IBill))
      )
  };

  post(bill: IBIllDto): Observable<IBIllDto> {
    return this.http.post<IBIllDto>(`${this.apiUrl}/bill`, bill)
      .pipe(
        retry(2),
        catchError(logAndThrowHttpError<IBIllDto>('post'))
      )
  };

  put(bill: IBIllDto): Observable<IBIllDto> {
    return this.http.put<IBIllDto>(`${this.apiUrl}/bill/${bill.id}`, bill)
      .pipe(
        retry(2),
        catchError(logAndThrowHttpError<IBIllDto>('put'))
      )
  };

  delete(id: string): Observable<IBIllDto> {
    return this.http.delete<{ data: IBIllDto, message: string, success: boolean }>(`${this.apiUrl}/bill/${id}`)
      .pipe(
        map(x => x.data),
        retry(2),
        catchError(logAndThrowHttpError<IBIllDto>('delete'))
      )
  };


}