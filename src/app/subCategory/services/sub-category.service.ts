import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, retry } from "rxjs";
import { ISubCategory, ISubCategoryDto } from 'src/app/core/models/ISubCategory';
import { logAndHandleHttpError, logAndThrowHttpError } from 'src/app/shared/http-utilities';
import { Environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubCategoryService {
  private readonly apiUrl = Environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAll(): Observable<ISubCategoryDto[]> {
    return this.http.get<ISubCategoryDto[]>(`${this.apiUrl}/subcategory`)
      .pipe(
        retry(2),
        catchError(logAndHandleHttpError('subcategory', [] as ISubCategoryDto[]))
      )
  };

  getById(id: string): Observable<ISubCategoryDto> {
    return this.http.get<ISubCategoryDto>(`${this.apiUrl}/subcategory/${id}`)
      .pipe(
        retry(2),
        catchError(logAndHandleHttpError('subcategory', {} as ISubCategoryDto))
      )
  };

  getAllByCategoryId(id: string): Observable<ISubCategory[]> {
    return this.http.get<ISubCategory[]>(`${this.apiUrl}/subcategory/getbycategoryid/${id}`)
      .pipe(
        retry(2),
        catchError(logAndHandleHttpError('ISubCategory', [] as ISubCategory[]))
      )
  };

  post(subCategory: ISubCategory): Observable<ISubCategory> {
    return this.http.post<ISubCategory>(`${this.apiUrl}/subcategory`, subCategory)
      .pipe(
        retry(2),
        catchError(logAndHandleHttpError('subcategory', subCategory))
      )
  };

  put(subCategory: ISubCategory): Observable<ISubCategory> {
    return this.http.put<ISubCategory>(`${this.apiUrl}/subcategory/${subCategory.id}`, subCategory)
      .pipe(
        retry(2),
        catchError(logAndHandleHttpError('subcategory', subCategory))
      )
  };

  delete(id: string): Observable<ISubCategory> {
    return this.http.delete<ISubCategory>(`${this.apiUrl}/subcategory/${id}`)
      .pipe(
        retry(2),
        catchError(logAndHandleHttpError('subcategory', {} as ISubCategory))
      )
  };
}
