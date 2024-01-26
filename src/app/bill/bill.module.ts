import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillListComponent } from './components/bill-list/bill-list.component';
import { BillRoutingModule } from './bill-routing.module';
import { AppMaterialsModule } from '../app-materials.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LandingBillComponent } from './pages/landing-bill/landing-bill.component';
import { CreateEditBillComponent } from './pages/create-edit-bill/create-edit-bill.component';
import { BillItemListComponent } from './components/bill-item-list/bill-item-list.component';

@NgModule({
  declarations: [
    BillListComponent,
    LandingBillComponent,
    CreateEditBillComponent,
    BillItemListComponent
  ],
  imports: [
    CommonModule,
    BillRoutingModule,
    AppMaterialsModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: []
})
export class BillModule { }
