import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { AuthResponse } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthStateService {
  private static readonly TOKEN_KEY = 'bt.auth.token';
  private static readonly EXPIRES_AT_KEY = 'bt.auth.expiresAt';

  private tokenSubject = new BehaviorSubject<string | null>(null);
  private expiresAtSubject = new BehaviorSubject<Date | null>(null);
  private readonly isBrowser: boolean;

  readonly token$ = this.tokenSubject.asObservable();
  readonly expiresAt$ = this.expiresAtSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      this.restoreSession();
    }
  }

  setSession(resp: AuthResponse) {
    const token = resp.token ?? null;
    const expiresAt = resp.expiresAtUtc ? new Date(resp.expiresAtUtc) : null;
    this.tokenSubject.next(token);
    this.expiresAtSubject.next(expiresAt);
    if (this.isBrowser) {
      this.persistSession(token, expiresAt);
    }
  }

  clearSession() {
    this.tokenSubject.next(null);
    this.expiresAtSubject.next(null);
    if (this.isBrowser) {
      sessionStorage.removeItem(AuthStateService.TOKEN_KEY);
      sessionStorage.removeItem(AuthStateService.EXPIRES_AT_KEY);
    }
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

  private restoreSession(): void {
    try {
      const storedToken = sessionStorage.getItem(AuthStateService.TOKEN_KEY);
      const storedExpiry = sessionStorage.getItem(AuthStateService.EXPIRES_AT_KEY);
      if (!storedToken || !storedExpiry) {
        return;
      }
      const expiryDate = new Date(storedExpiry);
      if (Number.isNaN(expiryDate.getTime())) {
        this.clearSession();
        return;
      }
      this.tokenSubject.next(storedToken);
      this.expiresAtSubject.next(expiryDate);
    } catch {
      this.clearSession();
    }
  }

  private persistSession(token: string | null, expiresAt: Date | null): void {
    if (!token || !expiresAt) {
      this.clearSession();
      return;
    }
    try {
      sessionStorage.setItem(AuthStateService.TOKEN_KEY, token);
      sessionStorage.setItem(AuthStateService.EXPIRES_AT_KEY, expiresAt.toISOString());
    } catch {
      this.clearSession();
    }
  }
}
