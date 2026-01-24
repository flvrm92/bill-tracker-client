import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { AuthStateService } from 'src/app/shared/services/auth-state.service';
import { ENVIRONMENT } from 'src/app/config/environment.token';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authState = inject(AuthStateService);
  const router = inject(Router);
  const env = inject(ENVIRONMENT);

  const isAuthEndpoint = req.url.startsWith(`${env.apiUrl}/auth/`);
  const isAsset = req.url.startsWith('assets/') || req.url.startsWith('/assets/');

  if (!isAuthEndpoint && !isAsset) {
    if (!authState.isTokenValid()) {
      const currentUrl = router.url;
      const redirectUrl = currentUrl && !currentUrl.startsWith('/login') ? currentUrl : '/home';
      // Avoid infinite loops when already on login
      if (!router.url.startsWith('/login')) {
        router.navigate(['/login'], { queryParams: { redirectUrl } });
      }
      return throwError(() => new Error('Authentication required'));
    }

    const token = authState.getToken();
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
  }

  return next(req);
};
