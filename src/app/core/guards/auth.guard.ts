import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthStateService } from 'src/app/shared/services/auth-state.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authState: AuthStateService, private router: Router) { }

  canActivate(): boolean | UrlTree {
    if (this.authState.isTokenValid()) {
      return true;
    }
    const redirectUrl = this.router.url && !this.router.url.startsWith('/login') ? this.router.url : '/home';
    return this.router.createUrlTree(['/login'], { queryParams: { redirectUrl } });
  }
}
