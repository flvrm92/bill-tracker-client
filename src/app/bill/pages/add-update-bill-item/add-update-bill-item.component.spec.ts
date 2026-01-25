import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { provideHttpClient } from '@angular/common/http';
import { ENVIRONMENT } from 'src/app/config/environment.token';
import { AddUpdateBillItemComponent } from './add-update-bill-item.component';

describe('AddUpdateBillItemComponent', () => {
  let component: AddUpdateBillItemComponent;
  let fixture: ComponentFixture<AddUpdateBillItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddUpdateBillItemComponent],
      providers: [
        provideHttpClient(),
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        { provide: ENVIRONMENT, useValue: { apiUrl: 'http://localhost:5047', production: false } }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AddUpdateBillItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
