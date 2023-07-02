import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingSubCategoryComponent } from './landing-subcategory.component';

describe('LandingSubCategoryComponent', () => {
  let component: LandingSubCategoryComponent;
  let fixture: ComponentFixture<LandingSubCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LandingSubCategoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LandingSubCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
