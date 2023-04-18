import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Environment } from '../../../environments/environment';
import { Observable, catchError, retry } from "rxjs";
import { ICategory } from "src/app/core/models/ICategory";
import { logAndHandleHttpError } from "src/app/shared/http-utilities";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly apiUrl = Environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAll(): Observable<ICategory[]> {
    return this.http.get<ICategory[]>(`${this.apiUrl}/category`)
      .pipe(
        retry(2),
        catchError(logAndHandleHttpError('category', [] as ICategory[]))
      )
  };


  post(category: ICategory): Observable<ICategory> {
    return this.http.post<ICategory>(`${this.apiUrl}/category`, category)
      .pipe(
        retry(2),
        catchError(logAndHandleHttpError('category', category))
      )
  };

  put(category: ICategory): Observable<ICategory> {
    return this.http.put<ICategory>(`${this.apiUrl}/category/${category.id}`, category)
      .pipe(
        retry(2),
        catchError(logAndHandleHttpError('category', category))
      )
  };

  delete(id: string): Observable<ICategory> {
    return this.http.delete<ICategory>(`${this.apiUrl}/category/${id}`)
      .pipe(
        retry(2),
        catchError(logAndHandleHttpError('category', {} as ICategory))
      )
  };
}