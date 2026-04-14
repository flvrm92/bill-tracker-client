import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateEditSubCategoryComponent } from './create-edit-subcategory.component';
import { SubCategoryService } from '../../services/sub-category.service';
import { CategoryService } from 'src/app/category/services/category.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import { Router, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ISubCategory, ISubCategoryDto } from 'src/app/core/models/ISubCategory';
import { ICategory } from 'src/app/core/models/ICategory';
import { provideRouter } from '@angular/router';
import { ENVIRONMENT } from 'src/app/config/environment.token';

describe('CreateEditSubCategoryComponent', () => {
  let component: CreateEditSubCategoryComponent;
  let fixture: ComponentFixture<CreateEditSubCategoryComponent>;
  let subCategoryService: jasmine.SpyObj<SubCategoryService>;
  let categoryService: jasmine.SpyObj<CategoryService>;
  let alertService: jasmine.SpyObj<AlertService>;
  let router: Router;
  let activatedRoute: any;

  const mockCategories: ICategory[] = [
    { id: '1', name: 'Category 1' },
    { id: '2', name: 'Category 2' }
  ];

  beforeEach(async () => {
    subCategoryService = jasmine.createSpyObj('SubCategoryService', ['getById', 'post', 'put']);
    categoryService = jasmine.createSpyObj('CategoryService', ['getAll']);
    alertService = jasmine.createSpyObj('AlertService', ['toastAlert', 'yesOrNoAlert']);
    activatedRoute = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue(null)
        }
      }
    };

    categoryService.getAll.and.returnValue(of(mockCategories));

    await TestBed.configureTestingModule({
      imports: [CreateEditSubCategoryComponent],
      providers: [
        { provide: SubCategoryService, useValue: subCategoryService },
        { provide: CategoryService, useValue: categoryService },
        { provide: AlertService, useValue: alertService },
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: ENVIRONMENT, useValue: { apiUrl: 'http://localhost:5047', production: false } },
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateEditSubCategoryComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load categories on init', () => {
    expect(categoryService.getAll).toHaveBeenCalled();
  });

  it('should initialize in create mode when no id', () => {
    expect(component.isUpdate).toBeFalsy();
  });

  it('should have invalid form when required fields are empty', () => {
    component.form.patchValue({ name: '', categoryId: '' });
    expect(component.form.valid).toBeFalsy();
  });

  it('should have valid form when all required fields are filled', () => {
    component.form.patchValue({
      name: 'Test SubCategory',
      categoryId: '1',
      active: true
    });
    expect(component.form.valid).toBeTruthy();
  });

  it('should create new subcategory', () => {
    const newSubCategory: ISubCategory = {
      id: '',
      name: 'New SubCategory',
      categoryId: '1',
      active: true
    };
    const savedSubCategory: ISubCategory = { ...newSubCategory, id: '123' };

    subCategoryService.post.and.returnValue(of(savedSubCategory));
    component.form.patchValue(newSubCategory);

    component.save();

    expect(subCategoryService.post).toHaveBeenCalledWith(jasmine.objectContaining({
      name: 'New SubCategory',
      categoryId: '1',
      active: true
    }));
    expect(alertService.toastAlert).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['subCategory']);
  });

  it('should update existing subcategory', () => {
    const existingSubCategory: ISubCategory = {
      id: '123',
      name: 'Updated SubCategory',
      categoryId: '2',
      active: false
    };

    subCategoryService.put.and.returnValue(of(existingSubCategory));
    component.form.patchValue(existingSubCategory);

    component.save();

    expect(subCategoryService.put).toHaveBeenCalledWith(jasmine.objectContaining({
      id: '123',
      name: 'Updated SubCategory',
      categoryId: '2',
      active: false
    }));
    expect(router.navigate).toHaveBeenCalledWith(['subCategory']);
  });

  it('should cancel without prompt when form is pristine', () => {
    component.form.markAsPristine();
    component.form.markAsUntouched();

    component.cancel();

    expect(router.navigate).toHaveBeenCalledWith(['subCategory']);
    expect(alertService.yesOrNoAlert).not.toHaveBeenCalled();
  });

  it('should show confirmation when canceling with dirty form', async () => {
    component.form.markAsDirty();
    alertService.yesOrNoAlert.and.returnValue(Promise.resolve(true));

    await component.cancel();

    expect(alertService.yesOrNoAlert).toHaveBeenCalledWith(jasmine.objectContaining({
      title: 'Discard changes'
    }));
    expect(router.navigate).toHaveBeenCalledWith(['subCategory']);
  });

  it('should not navigate when user cancels discard', async () => {
    component.form.markAsDirty();
    alertService.yesOrNoAlert.and.returnValue(Promise.resolve(false));

    await component.cancel();

    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should unsubscribe on destroy', () => {
    spyOn(component['destroy$'], 'next');
    spyOn(component['destroy$'], 'complete');

    component.ngOnDestroy();

    expect(component['destroy$'].next).toHaveBeenCalled();
    expect(component['destroy$'].complete).toHaveBeenCalled();
  });
});
