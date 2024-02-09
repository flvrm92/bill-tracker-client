import { Component, DestroyRef, EventEmitter, Inject, OnInit } from '@angular/core';
import { BillItemForm, CreateEditBillComponent } from '../create-edit-bill/create-edit-bill.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IBillItem, ICategory, ISubCategory, generateDefaultBillItem } from 'src/app/core/models';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryService } from 'src/app/category/services/category.service';
import { SubCategoryService } from 'src/app/subCategory/services/sub-category.service';
import { Observable } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-add-update-bill-item',
  templateUrl: './add-update-bill-item.component.html',
  styleUrl: './add-update-bill-item.component.scss'
})
export class AddUpdateBillItemComponent implements OnInit {

  form: FormGroup<BillItemForm>;

  categories$: Observable<ICategory[]> = this.categoryService.getAll();
  subCategories$: Observable<ISubCategory[]> | undefined;

  action: string = 'Create';

  isUpdate: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) data: IBillItem,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddUpdateBillItemComponent, IBillItem>,
    private categoryService: CategoryService,
    private subCategoryService: SubCategoryService,
    private destroyRef: DestroyRef) {

    this.form = CreateEditBillComponent.buildBillItemForm(this.fb, generateDefaultBillItem());

    if (data) {
      this.isUpdate = true;
      this.form.patchValue(data);
    }
  }

  ngOnInit() {
    this.form.controls.categoryId.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(id => this.subCategories$ = this.subCategoryService.getAllByCategoryId(id));
  }

  addItem() {
    const billItem = {
      id: this.form.controls.id.value,
      billId: this.form.controls.billId.value,
      description: this.form.controls.description.value,
      subCategoryId: this.form.controls.subCategoryId.value,
      subCategory: this.form.controls.subCategory.value,
      value: this.form.controls.value.value,
    } as IBillItem
    this.dialogRef.close(billItem);
  }

  cancel() {
    this.dialogRef.close();
  }
}
