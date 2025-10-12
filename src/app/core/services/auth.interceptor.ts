t import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthStateService } from 'src/app/shared/services/auth-state.service';
import { Router } from '@angular/router';
import { Environment } from 'src/environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authState: AuthStateService, private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const isAuthEndpoint = req.url.startsWith(`${Environment.apiUrl}/auth/`);
    const isAsset = req.url.startsWith('assets/') || req.url.startsWith('/assets/');

    if (!isAuthEndpoint && !isAsset) {
      if (!this.authState.isTokenValid()) {
        const currentUrl = this.router.url;
        const redirectUrl = currentUrl && !currentUrl.startsWith('/login') ? currentUrl : '/home';
        // Avoid infinite loops when already on login
        if (!this.router.url.startsWith('/login')) {
          this.router.navigate(['/login'], { queryParams: { redirectUrl } });
        }
        return throwError(() => new Error('Authentication required'));
      }

      const token = this.authState.getToken();
      if (token) {
        req = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
      }
    }

    return next.handle(req);
  }
}
