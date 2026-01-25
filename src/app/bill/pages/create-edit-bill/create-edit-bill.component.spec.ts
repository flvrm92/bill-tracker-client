import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateEditBillComponent } from './create-edit-bill.component';
import { BillService } from '../../services/bill.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { IBill, IBillItem } from 'src/app/core/models';
import { provideRouter } from '@angular/router';
import { provideNativeDateAdapter } from '@angular/material/core';
import { provideHttpClient } from '@angular/common/http';
import { ENVIRONMENT } from 'src/app/config/environment.token';
import { CategoryService } from 'src/app/category/services/category.service';
import { SubCategoryService } from 'src/app/subcategory/services/sub-category.service';

describe('CreateEditBillComponent', () => {
  let component: CreateEditBillComponent;
  let fixture: ComponentFixture<CreateEditBillComponent>;
  let billService: jasmine.SpyObj<BillService>;
  let alertService: jasmine.SpyObj<AlertService>;
  let categoryService: jasmine.SpyObj<CategoryService>;
  let subCategoryService: jasmine.SpyObj<SubCategoryService>;
  let router: Router;
  let dialog: jasmine.SpyObj<MatDialog>;
  let activatedRoute: any;

  beforeEach(async () => {
    billService = jasmine.createSpyObj('BillService', ['getById', 'post', 'put']);
    alertService = jasmine.createSpyObj('AlertService', ['toastAlert', 'yesOrNoAlert']);
    categoryService = jasmine.createSpyObj('CategoryService', ['getAll']);
    subCategoryService = jasmine.createSpyObj('SubCategoryService', ['getAll']);
    dialog = jasmine.createSpyObj('MatDialog', ['open']);
    activatedRoute = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue(null)
        }
      }
    };

    categoryService.getAll.and.returnValue(of([]));
    subCategoryService.getAll.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [CreateEditBillComponent],
      providers: [
        { provide: BillService, useValue: billService },
        { provide: AlertService, useValue: alertService },
        { provide: CategoryService, useValue: categoryService },
        { provide: SubCategoryService, useValue: subCategoryService },
        { provide: MatDialog, useValue: dialog },
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: ENVIRONMENT, useValue: { apiUrl: 'http://localhost:5047', production: false } },
        provideRouter([]),
        provideNativeDateAdapter(),
        provideHttpClient()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateEditBillComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize in create mode', () => {
    expect(component.isUpdate).toBeFalsy();
    expect(component.action).toBe('Create');
  });

  it('should create new bill', () => {
    const newBill = { id: '', paymentMonth: new Date(), totalIncoming: 3000, billItems: [] };
    billService.post.and.returnValue(of({ id: '123', paymentMonth: '2026-01-01', total: 0, totalIncoming: 3000 }));

    component.save();

    expect(billService.post).toHaveBeenCalled();
    expect(alertService.toastAlert).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['bill']);
  });

  it('should update existing bill', () => {
    component.isUpdate = true;
    component.form.patchValue({ id: '123' });
    billService.put.and.returnValue(of({ id: '123', paymentMonth: '2026-01-01', total: 0, totalIncoming: 3000 }));

    component.save();

    expect(billService.put).toHaveBeenCalled();
    expect(alertService.toastAlert).toHaveBeenCalled();
  });

  it('should cancel without prompt when form is pristine', () => {
    component.form.markAsPristine();
    component.form.markAsUntouched();

    component.cancel();

    expect(router.navigate).toHaveBeenCalledWith(['bill']);
    expect(alertService.yesOrNoAlert).not.toHaveBeenCalled();
  });

  it('should show confirmation when canceling with dirty form', async () => {
    component.form.markAsDirty();
    alertService.yesOrNoAlert.and.returnValue(Promise.resolve(true));

    await component.cancel();

    expect(alertService.yesOrNoAlert).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['bill']);
  });

  it('should add bill item through dialog', () => {
    const newItem: IBillItem = {
      id: '1',
      description: 'New Item',
      value: 150,
      subCategoryId: 'sc1',
      categoryId: 'cat1'
    } as IBillItem;

    const dialogRefMock = {
      afterClosed: () => of(newItem)
    };
    dialog.open.and.returnValue(dialogRefMock as any);

    component.addBillItem();

    expect(dialog.open).toHaveBeenCalled();
    expect(component.billItems.length).toBe(1);
    expect(component.billItems[0]).toEqual(newItem);
  });

  it('should delete bill item', () => {
    const item1: IBillItem = { id: '1', description: 'Item 1', value: 100 } as IBillItem;
    const item2: IBillItem = { id: '2', description: 'Item 2', value: 200 } as IBillItem;

    component.billItems = [item1, item2];
    component.form.controls.billItems.push(CreateEditBillComponent.buildBillItemForm(component['fb'], item1));
    component.form.controls.billItems.push(CreateEditBillComponent.buildBillItemForm(component['fb'], item2));

    component.onBillItemDelete(item1);

    expect(component.billItems.length).toBe(1);
    expect(component.billItems[0].id).toBe('2');
  });

  it('should recalculate total when bill item changes', () => {
    component.billItems = [
      { id: '1', description: 'Item 1', value: 100 } as IBillItem
    ];
    component.form.controls.billItems.push(
      CreateEditBillComponent.buildBillItemForm(component['fb'], component.billItems[0])
    );

    const updatedItem: IBillItem = { id: '1', description: 'Item 1', value: 300 } as IBillItem;
    component.onBillItemChange(updatedItem);

    expect(component.form.controls.total.value).toBe('300.00');
  });
});
