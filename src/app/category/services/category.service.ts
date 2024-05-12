import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Environment } from '../../../environments/environment';
import { Observable, ReplaySubject, catchError, retry, share, timer } from "rxjs";
import { ICategory } from "src/app/core/models/ICategory";
import { logAndHandleHttpError, logAndThrowHttpError } from "src/app/shared/http-utilities";

const CACHE_TIMEOUT_MS = 60000;

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly apiUrl = Environment.apiUrl;

  constructor(private http: HttpClient) { }

  private getCategories$: Observable<ICategory[]> | undefined;
  getAll(): Observable<ICategory[]> {
    return this.getCategories$ ??
      (this.getCategories$ = this.http
        .get<ICategory[]>(`${this.apiUrl}/category`)
        .pipe(retry(2),
          catchError(logAndHandleHttpError('category', [] as ICategory[])),
          share({
            connector: () => new ReplaySubject(1),
            resetOnComplete: () => timer(CACHE_TIMEOUT_MS)
          })
        )
      );
  };

  getById(id: string): Observable<ICategory> {
    return this.http.get<ICategory>(`${this.apiUrl}/category/${id}`)
      .pipe(
        retry(2),
        catchError(logAndHandleHttpError('category', {} as ICategory))
      )
  };

  post(category: ICategory): Observable<ICategory> {
    return this.http.post<ICategory>(`${this.apiUrl}/category`, category)
      .pipe(
        retry(2),
        catchError(logAndThrowHttpError<ICategory>('post'))
      )
  };

  put(category: ICategory): Observable<ICategory> {
    return this.http.put<ICategory>(`${this.apiUrl}/category/${category.id}`, category)
      .pipe(
        retry(2),
        catchError(logAndThrowHttpError<ICategory>('put'))
      )
  };

  delete(id: string): Observable<ICategory> {
    return this.http.delete<ICategory>(`${this.apiUrl}/category/${id}`)
      .pipe(
        retry(2),
        catchError(logAndThrowHttpError<ICategory>('delete'))
      )
  };
}