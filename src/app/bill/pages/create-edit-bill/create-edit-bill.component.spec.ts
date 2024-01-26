import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditBillComponent } from './create-edit-bill.component';

describe('CreateEditBillComponent', () => {
  let component: CreateEditBillComponent;
  let fixture: ComponentFixture<CreateEditBillComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateEditBillComponent]
    });
    fixture = TestBed.createComponent(CreateEditBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
