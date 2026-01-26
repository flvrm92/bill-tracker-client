import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { ENVIRONMENT } from '../../config/environment.token';
import { IBillDashboard, IBillDashboardDto } from '../../core/models/IBillStatistics';
import { logAndHandleHttpError } from '../../shared/http-utilities';

@Injectable({
  providedIn: 'root'
})
export class BillStatisticsService {
  private readonly env = inject(ENVIRONMENT);
  private readonly apiUrl = this.env.apiUrl;

  constructor(private http: HttpClient) { }

  /**
   * Fetches dashboard statistics data from the API
   * Converts date strings to Date objects for proper sorting
   * @returns Observable of bill dashboard data array
   */
  getDashboardData(): Observable<IBillDashboard[]> {
    return this.http.get<IBillDashboardDto[]>(`${this.apiUrl}/dashboard`)
      .pipe(
        retry(2),
        map(dtos => this.convertDtosToModels(dtos)),
        catchError(logAndHandleHttpError('bill-dashboards', [] as IBillDashboard[]))
      );
  }

  /**
   * Converts DTOs with string dates to models with Date objects
   * @param dtos Array of dashboard DTOs from API
   * @returns Array of dashboard models with Date objects
   */
  private convertDtosToModels(dtos: IBillDashboardDto[]): IBillDashboard[] {
    return dtos.map(dto => ({
      id: dto.id,
      paymentMonth: new Date(dto.paymentMonth),
      totalIncoming: dto.totalIncoming,
      billItems: dto.billItems
    }));
  }
}
