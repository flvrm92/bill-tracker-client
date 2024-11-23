import { Component, DestroyRef, Inject, OnInit } from '@angular/core';
import { BillItemForm, CreateEditBillComponent } from '../create-edit-bill/create-edit-bill.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IBillItem, ICategory, ISubCategory, generateDefaultBillItem } from 'src/app/core/models';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryService } from 'src/app/category/services/category.service';
import { SubCategoryService } from 'src/app/subCategory/services/sub-category.service';
import { forkJoin } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-add-update-bill-item',
    templateUrl: './add-update-bill-item.component.html',
    styleUrl: './add-update-bill-item.component.scss',
    standalone: false
})
export class AddUpdateBillItemComponent implements OnInit {

  form: FormGroup<BillItemForm>;

  categories: ICategory[];
  allSubCategories: ISubCategory[];
  subCategories: ISubCategory[];

  isUpdate: boolean = false;
  billItemInputData: IBillItem;

  constructor(
    @Inject(MAT_DIALOG_DATA) data: IBillItem,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddUpdateBillItemComponent, IBillItem>,
    private categoryService: CategoryService,
    private subCategoryService: SubCategoryService,
    private destroyRef: DestroyRef) {

    if (data) {
      this.isUpdate = true;
      this.billItemInputData = data;
    }

    this.form = CreateEditBillComponent.buildBillItemForm(this.fb, generateDefaultBillItem());
    
    this.form.controls.categoryId.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(id => this.subCategories = this.allSubCategories.filter(sc => sc.categoryId === id));
  }

  ngOnInit() {
    forkJoin([this.categoryService.getAll(), this.subCategoryService.getAll()])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([categories, allSubCategories]) => {
        this.categories = categories;
        this.allSubCategories = allSubCategories;

        if (this.isUpdate) this.fillForm();
      });
  }

  addUpdateItem() {
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

  private fillForm(): void {    
    const subCategory = this.allSubCategories.find(sc => sc.id === this.billItemInputData.subCategoryId);
    this.subCategories = this.allSubCategories.filter(sc => sc.categoryId === subCategory?.categoryId);

    const billItem = {
      id: this.billItemInputData.id,
      billId: this.billItemInputData.billId,
      description: this.billItemInputData.description,
      categoryId: subCategory?.categoryId,
      category: subCategory?.category,
      subCategoryId: subCategory?.id,
      subCategory: subCategory,
      value: this.billItemInputData.value,
    } as IBillItem;

    this.form = CreateEditBillComponent.buildBillItemForm(this.fb, billItem);
  }
}
