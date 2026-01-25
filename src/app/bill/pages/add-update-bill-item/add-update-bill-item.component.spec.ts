import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddUpdateBillItemComponent } from './add-update-bill-item.component';
import { CategoryService } from 'src/app/category/services/category.service';
import { SubCategoryService } from 'src/app/subcategory/services/sub-category.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { of } from 'rxjs';
import { IBillItem, ICategory } from 'src/app/core/models';
import { ISubCategoryDto } from 'src/app/core/models/ISubCategory';
import { provideNativeDateAdapter } from '@angular/material/core';
import { provideHttpClient } from '@angular/common/http';
import { ENVIRONMENT } from 'src/app/config/environment.token';

describe('AddUpdateBillItemComponent', () => {
  let component: AddUpdateBillItemComponent;
  let fixture: ComponentFixture<AddUpdateBillItemComponent>;
  let categoryService: jasmine.SpyObj<CategoryService>;
  let subCategoryService: jasmine.SpyObj<SubCategoryService>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<AddUpdateBillItemComponent>>;

  const mockCategories: ICategory[] = [
    { id: 'cat1', name: 'Groceries' },
    { id: 'cat2', name: 'Utilities' }
  ];

  const mockSubCategories: ISubCategoryDto[] = [
    { id: 'sc1', name: 'Fruits', categoryId: 'cat1', active: true, category: mockCategories[0] },
    { id: 'sc2', name: 'Vegetables', categoryId: 'cat1', active: true, category: mockCategories[0] },
    { id: 'sc3', name: 'Electricity', categoryId: 'cat2', active: true, category: mockCategories[1] },
    { id: 'sc4', name: 'Inactive', categoryId: 'cat1', active: false, category: mockCategories[0] }
  ];

  beforeEach(async () => {
    categoryService = jasmine.createSpyObj('CategoryService', ['getAll']);
    subCategoryService = jasmine.createSpyObj('SubCategoryService', ['getAll']);
    dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    categoryService.getAll.and.returnValue(of(mockCategories));
    subCategoryService.getAll.and.returnValue(of(mockSubCategories));

    await TestBed.configureTestingModule({
      imports: [AddUpdateBillItemComponent],
      providers: [
        { provide: CategoryService, useValue: categoryService },
        { provide: SubCategoryService, useValue: subCategoryService },
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: null },
        { provide: ENVIRONMENT, useValue: { apiUrl: 'http://localhost:5047', production: false } },
        provideNativeDateAdapter(),
        provideHttpClient()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddUpdateBillItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize in create mode when no data provided', () => {
    expect(component.isUpdate).toBeFalsy();
  });

  it('should load categories and subcategories on init', () => {
    expect(categoryService.getAll).toHaveBeenCalled();
    expect(subCategoryService.getAll).toHaveBeenCalled();
    expect(component.categories).toEqual(mockCategories);
    expect(component.allSubCategories.length).toBe(3); // Only active ones
  });

  it('should filter out inactive subcategories', () => {
    expect(component.allSubCategories.every(sc => sc.active)).toBeTruthy();
  });

  it('should filter subcategories when category changes', () => {
    component.form.controls.categoryId.setValue('cat1');

    expect(component.subCategories.length).toBe(2);
    expect(component.subCategories.every(sc => sc.categoryId === 'cat1')).toBeTruthy();
  });

  it('should add new bill item and close dialog', () => {
    component.form.patchValue({
      description: 'Test Item',
      subCategoryId: 'sc1',
      value: 150
    });

    component.addUpdateItem();

    expect(dialogRef.close).toHaveBeenCalledWith(jasmine.objectContaining({
      description: 'Test Item',
      subCategoryId: 'sc1',
      value: 150
    }));
  });

  it('should cancel and close dialog without data', () => {
    component.cancel();
    expect(dialogRef.close).toHaveBeenCalledWith();
  });

  it('should initialize in update mode with existing bill item', async () => {
    const existingItem: IBillItem = {
      id: '1',
      billId: 'bill1',
      description: 'Existing Item',
      categoryId: 'cat1',
      subCategoryId: 'sc1',
      value: 200
    } as IBillItem;

    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [AddUpdateBillItemComponent],
      providers: [
        { provide: CategoryService, useValue: categoryService },
        { provide: SubCategoryService, useValue: subCategoryService },
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: existingItem },
        provideNativeDateAdapter()
      ]
    }).compileComponents();

    const updateFixture = TestBed.createComponent(AddUpdateBillItemComponent);
    const updateComponent = updateFixture.componentInstance;
    updateFixture.detectChanges();

    expect(updateComponent.isUpdate).toBeTruthy();
    expect(updateComponent.billItemInputData).toEqual(existingItem);
  });

  it('should fill form with existing bill item data in update mode', async () => {
    const existingItem: IBillItem = {
      id: '1',
      billId: 'bill1',
      description: 'Existing Item',
      categoryId: 'cat1',
      subCategoryId: 'sc1',
      value: 200
    } as IBillItem;

    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [AddUpdateBillItemComponent],
      providers: [
        { provide: CategoryService, useValue: categoryService },
        { provide: SubCategoryService, useValue: subCategoryService },
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: existingItem },
        provideNativeDateAdapter()
      ]
    }).compileComponents();

    const updateFixture = TestBed.createComponent(AddUpdateBillItemComponent);
    const updateComponent = updateFixture.componentInstance;
    updateFixture.detectChanges();

    expect(updateComponent.form.controls.description.value).toBe('Existing Item');
    expect(updateComponent.form.controls.value.value).toBe(200);
  });

  it('should filter subcategories based on existing item category in update mode', async () => {
    const existingItem: IBillItem = {
      id: '1',
      billId: 'bill1',
      description: 'Existing Item',
      categoryId: 'cat1',
      subCategoryId: 'sc1',
      value: 200
    } as IBillItem;

    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [AddUpdateBillItemComponent],
      providers: [
        { provide: CategoryService, useValue: categoryService },
        { provide: SubCategoryService, useValue: subCategoryService },
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: existingItem },
        provideNativeDateAdapter()
      ]
    }).compileComponents();

    const updateFixture = TestBed.createComponent(AddUpdateBillItemComponent);
    const updateComponent = updateFixture.componentInstance;
    updateFixture.detectChanges();

    expect(updateComponent.subCategories.length).toBe(2);
    expect(updateComponent.subCategories.every(sc => sc.categoryId === 'cat1')).toBeTruthy();
  });
});
