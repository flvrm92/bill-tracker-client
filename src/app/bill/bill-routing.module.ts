import { RouterModule, Routes } from "@angular/router";
import { CreateEditComponent } from "./pages/create-edit/create-edit.component";
import { LandingComponent } from "./pages/landing/landing.component";
import { NgModule } from "@angular/core";

const routes: Routes = [
  { path: '', component: LandingComponent, title: 'Bills' },
  { path: 'create', component: CreateEditComponent, title: 'Create Bill' },
  { path: ':id', component: CreateEditComponent, title: 'Edit Bill' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BillRoutingModule { }