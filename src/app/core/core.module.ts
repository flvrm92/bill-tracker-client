import { NgModule } from "@angular/core";
import { ProgressBarComponent } from "./components/progress-bar/progress-bar.component";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AppMaterialsModule } from "../app-materials.module";

@NgModule({
  declarations: [ProgressBarComponent],
  imports: [
    CommonModule,
    RouterModule,
    AppMaterialsModule,
  ],
  providers: [],
  bootstrap: [],
  exports: [ProgressBarComponent]
})
export class CoreModule { }