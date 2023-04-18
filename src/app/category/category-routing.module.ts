import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LandingComponent } from "./pages/landing/landing.component";
import { CreateEditComponent } from "./pages/create-edit/create-edit.component";

const routes: Routes = [
  { path: '', component: LandingComponent, title: 'Categories' },
  { path: 'create', component: CreateEditComponent, title: 'Create Category' },
  { path: ':id', component: CreateEditComponent, title: 'Edit Category' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoryRoutingModule { }