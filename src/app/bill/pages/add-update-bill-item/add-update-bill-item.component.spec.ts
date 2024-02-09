import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateBillItemComponent } from './add-update-bill-item.component';

describe('AddUpdateBillItemComponent', () => {
  let component: AddUpdateBillItemComponent;
  let fixture: ComponentFixture<AddUpdateBillItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddUpdateBillItemComponent]
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
