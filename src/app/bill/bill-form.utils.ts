import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { IBillItem, ICategory, ISubCategory } from 'src/app/core/models';

export interface BillItemForm {
  id: FormControl<string | undefined>,
  billId: FormControl<string | undefined>,
  description: FormControl<string>,
  categoryId: FormControl<string>,
  category: FormControl<ICategory | undefined>,
  subCategoryId: FormControl<string>,
  subCategory: FormControl<ISubCategory | undefined>,
  value: FormControl<number | undefined>,
}

export interface BillForm {
  id: FormControl<string | undefined>,
  payment: FormControl<Date>,
  total: FormControl<string>,
  totalIncoming: FormControl<number>,
  billItems: FormArray<FormGroup<BillItemForm>>,
}

export function buildBillItemForm(fb: FormBuilder, billItem: IBillItem): FormGroup<BillItemForm> {
  return fb.nonNullable.group({
    id: billItem.id,
    billId: billItem.billId,
    description: billItem.description,
    categoryId: billItem.categoryId,
    category: billItem.category,
    subCategoryId: billItem.subCategoryId,
    subCategory: billItem.subCategory,
    value: billItem.value,
  });
}
