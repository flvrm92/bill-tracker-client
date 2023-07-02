import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LandingCategoryComponent } from "./pages/landing-category/landing-category.component";
import { CreateEditCategoryComponent } from "./pages/create-edit-category/create-edit-category.component";

const routes: Routes = [
  { path: '', component: LandingCategoryComponent, title: 'Categories' },
  { path: 'create', component: CreateEditCategoryComponent, title: 'Create Category' },
  { path: ':id', component: CreateEditCategoryComponent, title: 'Edit Category' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoryRoutingModule { }