import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthStateService } from 'src/app/shared/services/auth-state.service';
import { PLATFORM_ID } from '@angular/core';

describe('authGuard', () => {
  let authStateService: jasmine.SpyObj<AuthStateService>;
  let router: jasmine.SpyObj<Router>;
  let mockUrlTree: UrlTree;

  beforeEach(() => {
    authStateService = jasmine.createSpyObj('AuthStateService', ['isTokenValid']);
    router = jasmine.createSpyObj('Router', ['createUrlTree'], { url: '/home' });
    mockUrlTree = {} as UrlTree;
    router.createUrlTree.and.returnValue(mockUrlTree);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthStateService, useValue: authStateService },
        { provide: Router, useValue: router },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });
  });

  it('should allow activation when token is valid', () => {
    authStateService.isTokenValid.and.returnValue(true);

    const result = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));

    expect(result).toBe(true);
    expect(authStateService.isTokenValid).toHaveBeenCalled();
  });

  it('should redirect to login when token is invalid', () => {
    authStateService.isTokenValid.and.returnValue(false);

    const result = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));

    expect(result).toBe(mockUrlTree);
    expect(authStateService.isTokenValid).toHaveBeenCalled();
    expect(router.createUrlTree).toHaveBeenCalledWith(['/login'], {
      queryParams: { redirectUrl: '/home' }
    });
  });

  it('should use current route as redirectUrl', () => {
    authStateService.isTokenValid.and.returnValue(false);
    Object.defineProperty(router, 'url', { value: '/bills', writable: true });

    const result = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));

    expect(router.createUrlTree).toHaveBeenCalledWith(['/login'], {
      queryParams: { redirectUrl: '/bills' }
    });
  });

  it('should default to /home when current route is /login', () => {
    authStateService.isTokenValid.and.returnValue(false);
    (router as any).url = '/login';

    const result = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));

    expect(router.createUrlTree).toHaveBeenCalledWith(['/login'], {
      queryParams: { redirectUrl: '/home' }
    });
  });

  it('should default to /home when router.url is empty', () => {
    authStateService.isTokenValid.and.returnValue(false);
    (router as any).url = '';

    const result = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));

    expect(router.createUrlTree).toHaveBeenCalledWith(['/login'], {
      queryParams: { redirectUrl: '/home' }
    });
  });
});
