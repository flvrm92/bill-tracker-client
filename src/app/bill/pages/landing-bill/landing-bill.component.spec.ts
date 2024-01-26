import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingBillComponent } from './landing-bill.component';

describe('LandingBillComponent', () => {
  let component: LandingBillComponent;
  let fixture: ComponentFixture<LandingBillComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LandingBillComponent]
    });
    fixture = TestBed.createComponent(LandingBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
