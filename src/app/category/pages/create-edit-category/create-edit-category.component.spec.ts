import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateEditCategoryComponent } from './create-edit-category.component';
import { CategoryService } from '../../services/category.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import { Router, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ICategory } from 'src/app/core/models/ICategory';
import { provideRouter } from '@angular/router';
import { ENVIRONMENT } from 'src/app/config/environment.token';

describe('CreateEditCategoryComponent', () => {
  let component: CreateEditCategoryComponent;
  let fixture: ComponentFixture<CreateEditCategoryComponent>;
  let categoryService: jasmine.SpyObj<CategoryService>;
  let alertService: jasmine.SpyObj<AlertService>;
  let router: Router;
  let activatedRoute: any;

  beforeEach(async () => {
    categoryService = jasmine.createSpyObj('CategoryService', ['getById', 'post', 'put']);
    alertService = jasmine.createSpyObj('AlertService', ['toastAlert']);
    activatedRoute = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue(null)
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [CreateEditCategoryComponent],
      providers: [
        { provide: CategoryService, useValue: categoryService },
        { provide: AlertService, useValue: alertService },
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: ENVIRONMENT, useValue: { apiUrl: 'http://localhost:5047', production: false } },
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateEditCategoryComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize in create mode when no id in route', () => {
    expect(component.isUpdate).toBeFalsy();
    expect(component.form.get('id')?.value).toBe('');
  });

  it('should have invalid form when name is empty', () => {
    component.form.patchValue({ name: '' });
    expect(component.form.valid).toBeFalsy();
  });

  it('should have valid form when name is provided', () => {
    component.form.patchValue({ name: 'Test Category' });
    expect(component.form.valid).toBeTruthy();
  });

  it('should create new category', () => {
    const newCategory: ICategory = { id: '', name: 'New Category' };
    const savedCategory: ICategory = { id: '123', name: 'New Category' };

    categoryService.post.and.returnValue(of(savedCategory));
    component.form.patchValue(newCategory);

    component.save();

    expect(categoryService.post).toHaveBeenCalledWith(jasmine.objectContaining({
      name: 'New Category'
    }));
    expect(alertService.toastAlert).toHaveBeenCalledWith(jasmine.objectContaining({
      title: 'Category created'
    }));
    expect(router.navigate).toHaveBeenCalledWith(['category']);
  });

  it('should update existing category', () => {
    const existingCategory: ICategory = { id: '123', name: 'Updated Category' };

    // Set component to update mode
    component.isUpdate = true;
    categoryService.put.and.returnValue(of(existingCategory));
    component.form.patchValue(existingCategory);

    component.save();

    expect(categoryService.put).toHaveBeenCalledWith(jasmine.objectContaining({
      id: '123',
      name: 'Updated Category'
    }));
    expect(alertService.toastAlert).toHaveBeenCalledWith(jasmine.objectContaining({
      title: 'Category updated'
    }));
    expect(router.navigate).toHaveBeenCalledWith(['category']);
  });

  it('should sanitize category name', () => {
    const categoryWithHtml: ICategory = { id: '', name: '<script>alert("xss")</script>Test' };
    const savedCategory: ICategory = { id: '123', name: 'Test' };

    categoryService.post.and.returnValue(of(savedCategory));
    component.form.patchValue(categoryWithHtml);

    component.save();

    expect(categoryService.post).toHaveBeenCalled();
    const calledArg = categoryService.post.calls.mostRecent().args[0];
    expect(calledArg.name).not.toContain('<script>');
  });

  it('should handle save error', () => {
    const error = { error: { message: 'Save failed' } };
    categoryService.post.and.returnValue(throwError(() => error));

    component.form.patchValue({ name: 'Test' });
    component.save();

    expect(alertService.toastAlert).toHaveBeenCalledWith(jasmine.objectContaining({
      title: 'Error',
      text: 'Save failed'
    }));
  });

  it('should unsubscribe on destroy', () => {
    spyOn(component['destroy$'], 'next');
    spyOn(component['destroy$'], 'complete');

    component.ngOnDestroy();

    expect(component['destroy$'].next).toHaveBeenCalled();
    expect(component['destroy$'].complete).toHaveBeenCalled();
  });
});
