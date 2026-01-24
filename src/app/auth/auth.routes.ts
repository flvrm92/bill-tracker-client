import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'change-password',
    loadComponent: () => import('./pages/change-password/change-password.component').then(m => m.ChangePasswordComponent)
  }
];
