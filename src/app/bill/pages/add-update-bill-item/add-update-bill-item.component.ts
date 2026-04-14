import { Component, DestroyRef, OnInit, inject } from '@angular/core';

import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { BillItemForm, buildBillItemForm } from '../../bill-form.utils';
import { IBillItem, ICategory, ISubCategory, generateDefaultBillItem } from 'src/app/core/models';
import { CategoryService } from 'src/app/category/services/category.service';
import { SubCategoryService } from 'src/app/subcategory/services/sub-category.service';
import { forkJoin, Observable } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-add-update-bill-item',
  templateUrl: './add-update-bill-item.component.html',
  styleUrl: './add-update-bill-item.component.scss',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule
  ]
})
export class AddUpdateBillItemComponent implements OnInit {

  form: FormGroup<BillItemForm>;

  categories: ICategory[];
  allSubCategories: ISubCategory[];
  subCategories: ISubCategory[];

  filteredCategories$: Observable<ICategory[]>;

  isUpdate: boolean = false;
  billItemInputData: IBillItem;

  private readonly data = inject<IBillItem>(MAT_DIALOG_DATA);
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject<MatDialogRef<AddUpdateBillItemComponent, IBillItem>>(MatDialogRef);
  private readonly categoryService = inject(CategoryService);
  private readonly subCategoryService = inject(SubCategoryService);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    const data = this.data;
    if (data) {
      this.isUpdate = true;
      this.billItemInputData = data;
    }

    this.form = buildBillItemForm(this.fb, generateDefaultBillItem());

    this.form.controls.categoryId.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(id => this.subCategories = this.allSubCategories.filter(sc => sc.categoryId === id && sc.active));
  }

  ngOnInit() {
    forkJoin([this.categoryService.getAll(), this.subCategoryService.getAll()])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([categories, allSubCategories]) => {
        this.categories = categories;
        this.allSubCategories = allSubCategories.filter(sc => sc.active);

        if (this.isUpdate)
          this.fillForm();
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
    this.subCategories = this.allSubCategories.filter(sc => sc.categoryId === subCategory?.categoryId && sc.active);

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

    this.form = buildBillItemForm(this.fb, billItem);
  }
}
