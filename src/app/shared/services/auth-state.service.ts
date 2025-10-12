import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthResponse } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthStateService {
  private tokenSubject = new BehaviorSubject<string | null>(null);
  private expiresAtSubject = new BehaviorSubject<Date | null>(null);

  readonly token$ = this.tokenSubject.asObservable();
  readonly expiresAt$ = this.expiresAtSubject.asObservable();

  setSession(resp: AuthResponse) {
    const token = resp.token ?? null;
    const expiresAt = resp.expiresAtUtc ? new Date(resp.expiresAtUtc) : null;
    this.tokenSubject.next(token);
    this.expiresAtSubject.next(expiresAt);
  }

  clearSession() {
    this.tokenSubject.next(null);
    this.expiresAtSubject.next(null);
  }

  getToken(): string | null {
    return this.tokenSubject.value;
  }

  isTokenValid(now: Date = new Date(), skewSeconds: number = 5): boolean {
    const token = this.tokenSubject.value;
    const exp = this.expiresAtSubject.value;
    if (!token || !exp) return false;
    const skewMs = skewSeconds * 1000;
    return now.getTime() + skewMs < exp.getTime();
  }
}
