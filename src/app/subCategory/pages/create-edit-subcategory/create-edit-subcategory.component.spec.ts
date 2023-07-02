import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditSubCategoryComponent } from './create-edit-subcategory.component';

describe('CreateEditSubCategoryComponent', () => {
  let component: CreateEditSubCategoryComponent;
  let fixture: ComponentFixture<CreateEditSubCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateEditSubCategoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateEditSubCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
