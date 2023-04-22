import { Component, SecurityContext, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ICategory, generateDefaultCategory } from 'src/app/core/models/ICategory';
import { CategoryService } from '../../services/category.service';
import { AlertIcon, AlertService } from 'src/app/shared/services/alert.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create-edit',
  templateUrl: './create-edit.component.html',
  styleUrls: ['./create-edit.component.scss']
})
export class CreateEditComponent implements OnInit, OnDestroy {
  category: ICategory | undefined;

  form: FormGroup<CategoryForm>;

  private destroy$ = new Subject();

  constructor(
    private fb: FormBuilder,
    private domSanitizer: DomSanitizer,
    private categoryService: CategoryService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private router: Router) {
    this.form = CreateEditComponent.buildForm(fb, generateDefaultCategory());
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id') as string;
    if (id) {
      this.categoryService.getById(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe(category => this.form = CreateEditComponent.buildForm(this.fb, category));
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

    request.subscribe(result => {
      this.alertService.toastAlert({
        title: `Category ${requestBody.id ? 'updated' : 'created'}`,
        text: `Category ${result.name} was ${requestBody.id ? 'updated' : 'created'} successfully.`,
        icon: AlertIcon.Success,
      });

      this.router.navigate(['category']);
    });
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