import { Component, SecurityContext } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ICategory, generateDefaultCategory } from 'src/app/core/models/ICategory';
import { CategoryService } from '../../services/category-service';
import { AlertIcon, AlertService } from 'src/app/shared/services/alert.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-create-edit',
  templateUrl: './create-edit.component.html',
  styleUrls: ['./create-edit.component.scss']
})
export class CreateEditComponent {
  category: ICategory | undefined;

  form: FormGroup<CategoryForm>;

  constructor(fb: FormBuilder,
    private domSanitizer: DomSanitizer,
    private categoryService: CategoryService,
    private alertService: AlertService) {
    this.form = CreateEditComponent.buildForm(fb, generateDefaultCategory());
  }

  save() {
    const category = this.form.getRawValue();
    const categoryName = this.domSanitizer.sanitize(SecurityContext.HTML, category.name) || '';

    const requestBody: ICategory = {
      id: category.id,
      name: categoryName,
    }

    const request: Observable<ICategory> = requestBody.id
      ? this.categoryService.post(requestBody)
      : this.categoryService.put(requestBody);

    request.subscribe(result => {
      this.alertService.toastAlert({
        title: `Category ${requestBody.id ? 'updated' : 'created'}`,
        text: `Category ${result.name} was ${requestBody.id ? 'updated' : 'created'} successfully.`,
        icon: AlertIcon.Success,
      });
      if (result) {
        this.category = result;
      }
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