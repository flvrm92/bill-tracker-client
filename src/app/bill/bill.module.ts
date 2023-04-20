import { NgModule } from "@angular/core";
import { ListComponent } from "./components/list/list.component";
import { LandingComponent } from "./pages/landing/landing.component";
import { CreateEditComponent } from "./pages/create-edit/create-edit.component";
import { CommonModule } from "@angular/common";
import { AppMaterialsModule } from "../app-materials.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BillRoutingModule } from "./bill-routing.module";

@NgModule({
  declarations: [
    ListComponent,
    LandingComponent,
    CreateEditComponent,
  ],
  imports: [
    CommonModule,
    BillRoutingModule,
    AppMaterialsModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [],
})

export class BillModule { }