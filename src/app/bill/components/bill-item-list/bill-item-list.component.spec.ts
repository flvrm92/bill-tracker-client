import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillItemListComponent } from './bill-item-list.component';

describe('BillItemListComponent', () => {
  let component: BillItemListComponent;
  let fixture: ComponentFixture<BillItemListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BillItemListComponent]
    });
    fixture = TestBed.createComponent(BillItemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
