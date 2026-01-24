import { Routes } from '@angular/router';

export const SUBCATEGORY_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/landing-subcategory/landing-subcategory.component').then(m => m.LandingSubCategoryComponent),
    title: 'Sub Categories'
  },
  {
    path: 'create',
    loadComponent: () => import('./pages/create-edit-subcategory/create-edit-subcategory.component').then(m => m.CreateEditSubCategoryComponent),
    title: 'Create SubCategory'
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/create-edit-subcategory/create-edit-subcategory.component').then(m => m.CreateEditSubCategoryComponent),
    title: 'Edit Sub Category'
  }
];