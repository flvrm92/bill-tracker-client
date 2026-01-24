import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthStateService } from 'src/app/shared/services/auth-state.service';

export const authGuard: CanActivateFn = (): boolean | UrlTree => {
  const authState = inject(AuthStateService);
  const router = inject(Router);

  if (authState.isTokenValid()) {
    return true;
  }

  const redirectUrl = router.url && !router.url.startsWith('/login') ? router.url : '/home';
  return router.createUrlTree(['/login'], { queryParams: { redirectUrl } });
};
