import { Routes } from '@angular/router';

export const BILL_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/landing-bill/landing-bill.component').then(m => m.LandingBillComponent),
    title: 'Bills'
  },
  {
    path: 'create',
    loadComponent: () => import('./pages/create-edit-bill/create-edit-bill.component').then(m => m.CreateEditBillComponent),
    title: 'Create Bill'
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/create-edit-bill/create-edit-bill.component').then(m => m.CreateEditBillComponent),
    title: 'Edit Bill'
  }
];