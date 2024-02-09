import { Component, SecurityContext, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ICategory, generateDefaultCategory } from 'src/app/core/models/ICategory';
import { CategoryService } from '../../services/category.service';
import { AlertIcon, AlertService } from 'src/app/shared/services/alert.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create-edit-caetgory',
  templateUrl: './create-edit-category.component.html',
  styleUrls: ['./create-edit-category.component.scss']
})
export class CreateEditCategoryComponent implements OnInit, OnDestroy {
  category: ICategory | undefined;

  form: FormGroup<CategoryForm>;

  private destroy$ = new Subject();

  isUpdate: boolean = false;
  constructor(
    private fb: FormBuilder,
    private domSanitizer: DomSanitizer,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private router: Router) {
    this.form = CreateEditCategoryComponent.buildForm(fb, generateDefaultCategory());
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id') as string;
    if (id) {
      this.isUpdate = true;
      this.categoryService.getById(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe(category => this.form = CreateEditCategoryComponent.buildForm(this.fb, category));
    }
  }

  save() {
    const category = this.form.getRawValue();
    const categoryName = this.domSanitizer.sanitize(SecurityContext.HTML, category.name) || '';

    const requestBody: ICategory = {
      id: category.id,
      name: categoryName,
    }

    const request = requestBody.id ? this.categoryService.put(requestBody) : this.categoryService.post(requestBody);

    request.subscribe(() => {
      this.alertService.toastAlert({
        title: `Category ${this.isUpdate ? 'updated' : 'created'}`,
        text: `Category was ${this.isUpdate ? 'updated' : 'created'} successfully.`,
        icon: AlertIcon.Success,
      });
      this.router.navigate(['category']);
    });
  }

  cancel() {
    if (this.form.dirty || this.form.touched) {
      this.alertService.yesOrNoAlert({
        title: 'Discard changes',
        text: 'Are you sure you want to discard the changes?',
        icon: AlertIcon.Warning,
      }).then(result => {
        if (result) this.router.navigate(['category'])
      })
    } else {
      this.router.navigate(['category'])
    }
  }

  static buildForm(fb: FormBuilder, category: ICategory): FormGroup<CategoryForm> {
    return fb.nonNullable.group({
      id: category.id,
      name: [category.name, Validators.required],
    });
  }
}

export interface CategoryResult {
  success: boolean,
  category: ICategory,
  message: string,
}

export interface CategoryForm {
  id: FormControl<string>,
  name: FormControl<string>,
}