import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable } from "rxjs";
import { Environment } from "src/environments/environment";
import { logAndHandleHttpError } from "../http-utilities";

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private readonly apiUrl = Environment.apiUrl;

  constructor(private http: HttpClient) { }

  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(catchError(logAndHandleHttpError('auth', { email: credentials.email } as any)));
  }
}

export interface AuthResponse {
  token: string;
  expiresAtUtc: Date;
}

