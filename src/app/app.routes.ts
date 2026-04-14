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
        path: 'login',
        loadComponent: () => import('./auth/pages/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'change-password',
        loadComponent: () => import('./auth/pages/change-password/change-password.component').then(m => m.ChangePasswordComponent)
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
        loadComponent: () => import('./home/pages/home/home.component').then(m => m.HomeComponent),
        title: 'Bill Tracker'
      },
      {
        path: 'category',
        children: [
          {
            path: '',
            loadComponent: () => import('./category/pages/landing-category/landing-category.component').then(m => m.LandingCategoryComponent),
            title: 'Categories'
          },
          {
            path: 'create',
            loadComponent: () => import('./category/pages/create-edit-category/create-edit-category.component').then(m => m.CreateEditCategoryComponent),
            title: 'Create Category'
          },
          {
            path: ':id',
            loadComponent: () => import('./category/pages/create-edit-category/create-edit-category.component').then(m => m.CreateEditCategoryComponent),
            title: 'Edit Category'
          }
        ]
      },
      {
        path: 'subCategory',
        children: [
          {
            path: '',
            loadComponent: () => import('./subcategory/pages/landing-subcategory/landing-subcategory.component').then(m => m.LandingSubCategoryComponent),
            title: 'Sub Categories'
          },
          {
            path: 'create',
            loadComponent: () => import('./subcategory/pages/create-edit-subcategory/create-edit-subcategory.component').then(m => m.CreateEditSubCategoryComponent),
            title: 'Create SubCategory'
          },
          {
            path: ':id',
            loadComponent: () => import('./subcategory/pages/create-edit-subcategory/create-edit-subcategory.component').then(m => m.CreateEditSubCategoryComponent),
            title: 'Edit Sub Category'
          }
        ]
      },
      {
        path: 'bill',
        children: [
          {
            path: '',
            loadComponent: () => import('./bill/pages/landing-bill/landing-bill.component').then(m => m.LandingBillComponent),
            title: 'Bills'
          },
          {
            path: 'create',
            loadComponent: () => import('./bill/pages/create-edit-bill/create-edit-bill.component').then(m => m.CreateEditBillComponent),
            title: 'Create Bill'
          },
          {
            path: ':id',
            loadComponent: () => import('./bill/pages/create-edit-bill/create-edit-bill.component').then(m => m.CreateEditBillComponent),
            title: 'Edit Bill'
          }
        ]
      }
    ]
  }
];