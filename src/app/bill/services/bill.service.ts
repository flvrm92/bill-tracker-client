import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, retry } from "rxjs";
import { IBill } from "src/app/core/models/IBill";
import { logAndHandleHttpError } from "src/app/shared/http-utilities";
import { Environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})

export class BillService {
  private readonly apiUrl = Environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAll(): Observable<IBill[]> {
    return this.http.get<IBill[]>(`${this.apiUrl}/bill`)
      .pipe(
        retry(2),
        catchError(logAndHandleHttpError('bill', [] as IBill[]))
      )
  };

  post(bill: IBill): Observable<IBill> {
    return this.http.post<IBill>(`${this.apiUrl}/bill`, bill)
      .pipe(
        retry(2),
        catchError(logAndHandleHttpError('bill', bill))
      )
  };

  put(bill: IBill): Observable<IBill> {
    return this.http.put<IBill>(`${this.apiUrl}/bill/${bill.id}`, bill)
      .pipe(
        retry(2),
        catchError(logAndHandleHttpError('bill', bill))
      )
  };

  delete(id: string): Observable<IBill> {
    return this.http.delete<IBill>(`${this.apiUrl}/bill/${id}`)
      .pipe(
        retry(2),
        catchError(logAndHandleHttpError('bill', {} as IBill))
      )
  };
}
