import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { IBill, IBillItem, generateDefaultBill, generateDefaultBillItem } from 'src/app/core/models';

@Component({
  selector: 'app-create-edit-bill',
  templateUrl: './create-edit-bill.component.html',
  styleUrls: ['./create-edit-bill.component.scss']
})
export class CreateEditBillComponent implements OnInit, OnDestroy {
  bill: IBill | undefined;

  form: FormGroup<BillForm>;

  constructor(private fb: FormBuilder) {
    this.form = CreateEditBillComponent.buildForm(this.fb, generateDefaultBill());
  }

  ngOnInit(): void {
    
  }
  ngOnDestroy(): void {
    
  }

  save() {
    console.log('save bills');
  }

  cancel() {
    console.log('cancel bills');
  }

  addBillItem() {
    this.form.controls.billItems.push(CreateEditBillComponent.buildBillItemForm(this.fb, generateDefaultBillItem()));
    console.log(this.form.controls.billItems.value);
  }

  static buildForm(fb: FormBuilder, bill: IBill): FormGroup<BillForm> {
    return fb.nonNullable.group({
      id: bill?.id,
      payment: bill?.payment,
      total: bill?.total,
      totalIncoming: bill?.totalIncoming,
      billItems: fb.array<FormGroup<BillItemForm>>(
        bill?.billItems?.map(bi => CreateEditBillComponent.buildBillItemForm(fb, bi))) ?? [generateDefaultBillItem()]
    })
  }

  static buildBillItemForm(fb: FormBuilder, billItem: IBillItem): FormGroup<BillItemForm> {
    return fb.nonNullable.group({
      categoryId: billItem.categoryId,
      subCategoryId: billItem.subCategoryId,
      value: billItem.value,
    })
  }
}

export interface BillForm {
  id: FormControl<string>,
  payment: FormControl<Date>,
  total: FormControl<number>,
  totalIncoming: FormControl<number>,
  billItems: FormArray<FormGroup<BillItemForm>>,
}

export interface BillItemForm {
  categoryId: FormControl<string>,
  subCategoryId: FormControl<string>,
  value: FormControl<number>,
}
