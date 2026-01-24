import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./auth/auth.routes').then(m => m.AUTH_ROUTES)
      }
    ]
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'home',
        loadChildren: () => import('./home/home.routes').then(m => m.HOME_ROUTES)
      },
      {
        path: 'category',
        loadChildren: () => import('./category/category.routes').then(m => m.CATEGORY_ROUTES)
      },
      {
        path: 'subCategory',
        loadChildren: () => import('./subcategory/subcategory.routes').then(m => m.SUBCATEGORY_ROUTES)
      },
      {
        path: 'bill',
        loadChildren: () => import('./bill/bill.routes').then(m => m.BILL_ROUTES)
      }
    ]
  }
];