import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LandingSubCategoryComponent } from "./pages/landing-subcategory/landing-subcategory.component";
import { CreateEditSubCategoryComponent } from "./pages/create-edit-subcategory/create-edit-subcategory.component";

const routes: Routes = [
  { path: '', component: LandingSubCategoryComponent, title: 'Sub Categories' },
  { path: 'create', component: CreateEditSubCategoryComponent, title: 'Create SubCategory' },
  { path: ':id', component: CreateEditSubCategoryComponent, title: 'Edit Sub Category' },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubCategoryRoutingModule { }