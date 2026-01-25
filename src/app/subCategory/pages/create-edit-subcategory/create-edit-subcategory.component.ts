import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from 'src/app/category/services/category.service';
import { ISubCategory, generateDefaultSubCategory } from 'src/app/core/models/ISubCategory';
import { AlertIcon, AlertService } from 'src/app/shared/services/alert.service';
import { SubCategoryService } from '../../services/sub-category.service';
import { Subject, takeUntil, Observable } from 'rxjs';
import { ICategory } from 'src/app/core/models/ICategory';

@Component({
  selector: 'app-create-edit-subcategory',
  templateUrl: './create-edit-subcategory.component.html',
  styleUrls: ['./create-edit-subcategory.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
    MatIconModule
  ]
})
export class CreateEditSubCategoryComponent implements OnDestroy, OnInit {
  subCategory: ISubCategory | undefined;
  categories$: Observable<ICategory[]> | undefined;

  form: FormGroup<SubCategoryForm>;

  private destroy$ = new Subject();

  isUpdate: boolean = false;

  constructor(private fb: FormBuilder,
    private categoryService: CategoryService,
    private subCategoryService: SubCategoryService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private router: Router) {
    this.form = CreateEditSubCategoryComponent.buildForm(fb, generateDefaultSubCategory());
  }

  ngOnInit(): void {
    this.categories$ = this.categoryService.getAll();
    const id = this.route.snapshot.paramMap.get('id') as string;
    if (id) {
      this.isUpdate = true;
      this.subCategoryService.getById(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe(subCategory => this.form = CreateEditSubCategoryComponent.buildForm(this.fb, subCategory));
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  save() {
    const subCategory = this.form.getRawValue();

    const requestBody: ISubCategory = {
      id: subCategory.id,
      name: subCategory.name,
      categoryId: subCategory.categoryId,
      active: subCategory.active
    }

    const request = requestBody.id ? this.subCategoryService.put(requestBody) : this.subCategoryService.post(requestBody);

    request.subscribe(() => {
      this.alertService.toastAlert({
        title: `Sub category ${this.isUpdate ? 'updated' : 'created'}`,
        text: `Sub category ${this.isUpdate ? 'updated' : 'created'} successfully.`,
        icon: AlertIcon.Success,
      });

      this.router.navigate(['subCategory']);
    });
  }

  cancel() {
    if (this.form.dirty || this.form.touched) {
      this.alertService.yesOrNoAlert({
        title: 'Discard changes',
        text: 'Are you sure you want to discard the changes?',
        icon: AlertIcon.Warning,
      }).then(result => {
        if (result) this.router.navigate(['subCategory'])
      })
    } else {
      this.router.navigate(['subCategory']);
    }
  }

  static buildForm(fb: FormBuilder, subCategory: ISubCategory): FormGroup<SubCategoryForm> {
    return fb.nonNullable.group({
      id: subCategory.id,
      name: [subCategory.name, Validators.required],
      categoryId: [subCategory.categoryId, Validators.required],
      active: [subCategory.active, Validators.required]
    });
  }
}

export interface SubCategoryResult {
  success: boolean,
  category: ISubCategory,
  message: string,
}

export interface SubCategoryForm {
  id: FormControl<string>,
  name: FormControl<string>,
  categoryId: FormControl<string>,
  active: FormControl<boolean>
}
