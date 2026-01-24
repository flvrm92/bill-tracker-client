import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, Observable } from "rxjs";
import { ENVIRONMENT } from "src/app/config/environment.token";
import { logAndThrowHttpError } from "../http-utilities";

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private readonly env = inject(ENVIRONMENT);
  private readonly apiUrl = this.env.apiUrl;

  constructor(private http: HttpClient) { }

  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(catchError(logAndThrowHttpError<AuthResponse>('auth')));
  }

  changePassword(changeRequest: { email: string; currentPassword: string; newPassword: string }): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/auth/change-password`, changeRequest)
      .pipe(catchError(logAndThrowHttpError<void>('auth')));
  }
}

export interface AuthResponse {
  token: string;
  expiresAtUtc: Date;
}

