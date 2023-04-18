import { NgModule } from "@angular/core";
import { ListComponent } from "./components/list/list.component";
import { LandingComponent } from "./pages/landing/landing.component";
import { CreateEditComponent } from "./pages/create-edit/create-edit.component";
import { CategoryRoutingModule } from "./category-routing.module";
import { CommonModule } from "@angular/common";
import { AppMaterialsModule } from "../app-materials.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [
    ListComponent,
    LandingComponent,
    CreateEditComponent
  ],
  imports: [
    CommonModule,
    CategoryRoutingModule,    
    AppMaterialsModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: [],
})
export class CategoryModule { }