import { Routes } from '@angular/router';

export const CATEGORY_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/landing-category/landing-category.component').then(m => m.LandingCategoryComponent),
    title: 'Categories'
  },
  {
    path: 'create',
    loadComponent: () => import('./pages/create-edit-category/create-edit-category.component').then(m => m.CreateEditCategoryComponent),
    title: 'Create Category'
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/create-edit-category/create-edit-category.component').then(m => m.CreateEditCategoryComponent),
    title: 'Edit Category'
  }
];