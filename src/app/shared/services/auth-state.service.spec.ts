import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { AuthStateService } from './auth-state.service';
import { AuthResponse } from './auth.service';

describe('AuthStateService', () => {
  let service: AuthStateService;
  let mockSessionStorage: { [key: string]: string };

  beforeEach(() => {
    mockSessionStorage = {};

    spyOn(sessionStorage, 'getItem').and.callFake((key: string) => {
      return mockSessionStorage[key] || null;
    });

    spyOn(sessionStorage, 'setItem').and.callFake((key: string, value: string) => {
      mockSessionStorage[key] = value;
    });

    spyOn(sessionStorage, 'removeItem').and.callFake((key: string) => {
      delete mockSessionStorage[key];
    });

    TestBed.configureTestingModule({
      providers: [
        AuthStateService,
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });
    service = TestBed.inject(AuthStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('setSession', () => {
    it('should set token and expiration', (done) => {
      const authResponse: AuthResponse = {
        token: 'test-token',
        expiresAtUtc: new Date('2026-12-31T23:59:59Z')
      };

      service.setSession(authResponse);

      service.token$.subscribe(token => {
        expect(token).toBe('test-token');
      });

      service.expiresAt$.subscribe(expiresAt => {
        expect(expiresAt).toEqual(new Date('2026-12-31T23:59:59Z'));
        done();
      });
    });

    it('should persist session to sessionStorage', () => {
      const authResponse: AuthResponse = {
        token: 'test-token',
        expiresAtUtc: new Date('2026-12-31T23:59:59Z')
      };

      service.setSession(authResponse);

      expect(sessionStorage.setItem).toHaveBeenCalledWith('bt.auth.token', 'test-token');
      expect(sessionStorage.setItem).toHaveBeenCalledWith('bt.auth.expiresAt', jasmine.any(String));
    });
  });

  describe('clearSession', () => {
    it('should clear token and expiration', (done) => {
      const authResponse: AuthResponse = {
        token: 'test-token',
        expiresAtUtc: new Date('2026-12-31T23:59:59Z')
      };

      service.setSession(authResponse);
      service.clearSession();

      service.token$.subscribe(token => {
        expect(token).toBeNull();
      });

      service.expiresAt$.subscribe(expiresAt => {
        expect(expiresAt).toBeNull();
        done();
      });
    });

    it('should remove from sessionStorage', () => {
      service.clearSession();

      expect(sessionStorage.removeItem).toHaveBeenCalledWith('bt.auth.token');
      expect(sessionStorage.removeItem).toHaveBeenCalledWith('bt.auth.expiresAt');
    });
  });

  describe('getToken', () => {
    it('should return current token', () => {
      const authResponse: AuthResponse = {
        token: 'test-token',
        expiresAtUtc: new Date('2026-12-31T23:59:59Z')
      };

      service.setSession(authResponse);
      
      expect(service.getToken()).toBe('test-token');
    });

    it('should return null when no token is set', () => {
      expect(service.getToken()).toBeNull();
    });
  });

  describe('isTokenValid', () => {
    it('should return true for valid token', () => {
      const futureDate = new Date();
      futureDate.setHours(futureDate.getHours() + 1);

      const authResponse: AuthResponse = {
        token: 'test-token',
        expiresAtUtc: futureDate
      };

      service.setSession(authResponse);
      
      expect(service.isTokenValid()).toBe(true);
    });

    it('should return false for expired token', () => {
      const pastDate = new Date();
      pastDate.setHours(pastDate.getHours() - 1);

      const authResponse: AuthResponse = {
        token: 'test-token',
        expiresAtUtc: pastDate
      };

      service.setSession(authResponse);
      
      expect(service.isTokenValid()).toBe(false);
    });

    it('should return false when no token is set', () => {
      expect(service.isTokenValid()).toBe(false);
    });

    it('should account for clock skew', () => {
      const nearFutureDate = new Date();
      nearFutureDate.setSeconds(nearFutureDate.getSeconds() + 3);

      const authResponse: AuthResponse = {
        token: 'test-token',
        expiresAtUtc: nearFutureDate
      };

      service.setSession(authResponse);
      
      // With 5 second skew, should be invalid
      expect(service.isTokenValid(new Date(), 5)).toBe(false);
      
      // With 1 second skew, should be valid
      expect(service.isTokenValid(new Date(), 1)).toBe(true);
    });
  });
});
