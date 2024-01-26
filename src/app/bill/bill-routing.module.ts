import { NgModule } from '@angular/core';
import { Route, RouterModule, Routes } from '@angular/router';
import { LandingBillComponent } from './pages/landing-bill/landing-bill.component';
import { CreateEditBillComponent } from './pages/create-edit-bill/create-edit-bill.component';

const routes: Routes = [
  { path: '', component: LandingBillComponent, title: 'Bills' },
  { path: 'create', component: CreateEditBillComponent, title: 'Create Bill' },
  { path: ':id', component: CreateEditBillComponent, title: 'Edit Bill' },
]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BillRoutingModule { }
