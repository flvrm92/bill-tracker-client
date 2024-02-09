import { NgModule } from "@angular/core";
import { CategoryListComponent } from "./components/category-list/category-list.component";
import { LandingCategoryComponent } from "./pages/landing-category/landing-category.component";
import { CreateEditCategoryComponent } from "./pages/create-edit-category/create-edit-category.component";
import { CategoryRoutingModule } from "./category-routing.module";
import { CommonModule, TitleCasePipe } from "@angular/common";
import { AppMaterialsModule } from "../app-materials.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [
    CategoryListComponent,
    LandingCategoryComponent,
    CreateEditCategoryComponent
  ],
  imports: [
    CommonModule,
    CategoryRoutingModule,
    AppMaterialsModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: [],
  providers: [TitleCasePipe],
})
export class CategoryModule { }