import { NgModule } from "@angular/core";
import { SubCategoryListComponent } from "./components/subcategory-list/subcategory-list.component";
import { SubCategoryRoutingModule } from "./subcategory-routing.module";
import { CommonModule, TitleCasePipe } from "@angular/common";
import { AppMaterialsModule } from "../app-materials.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { LandingSubCategoryComponent } from "./pages/landing-subcategory/landing-subcategory.component";
import { CreateEditSubCategoryComponent } from "./pages/create-edit-subcategory/create-edit-subcategory.component";

@NgModule({
  declarations: [
    SubCategoryListComponent,
    LandingSubCategoryComponent,
    CreateEditSubCategoryComponent
  ],
  imports: [
    CommonModule,
    SubCategoryRoutingModule,
    AppMaterialsModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: [],
  providers: [TitleCasePipe],
})
export class SubCategoryModule { }