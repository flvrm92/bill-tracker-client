import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LandingSubCategoryComponent } from './landing-subcategory.component';
import { SubCategoryService } from '../../services/sub-category.service';
import { of } from 'rxjs';
import { ISubCategoryDto } from 'src/app/core/models/ISubCategory';
import { provideRouter } from '@angular/router';

describe('LandingSubCategoryComponent', () => {
  let component: LandingSubCategoryComponent;
  let fixture: ComponentFixture<LandingSubCategoryComponent>;
  let subCategoryService: jasmine.SpyObj<SubCategoryService>;

  const mockSubCategories: ISubCategoryDto[] = [
    { id: '1', name: 'Fruits', categoryId: 'cat1', category: { id: 'cat1', name: 'Groceries' }, active: true },
    { id: '2', name: 'Vegetables', categoryId: 'cat1', category: { id: 'cat1', name: 'Groceries' }, active: true },
    { id: '3', name: 'Electricity', categoryId: 'cat2', category: { id: 'cat2', name: 'Utilities' }, active: true }
  ];

  beforeEach(async () => {
    subCategoryService = jasmine.createSpyObj('SubCategoryService', ['getAll']);
    subCategoryService.getAll.and.returnValue(of(mockSubCategories));

    await TestBed.configureTestingModule({
      imports: [LandingSubCategoryComponent],
      providers: [
        { provide: SubCategoryService, useValue: subCategoryService },
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LandingSubCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load subcategories on init', () => {
    expect(subCategoryService.getAll).toHaveBeenCalled();
    expect(component.subcategories).toEqual(mockSubCategories);
  });

  it('should have empty subcategories initially', () => {
    const newComponent = new LandingSubCategoryComponent(subCategoryService);
    expect(newComponent.subcategories).toEqual([]);
  });

  it('should unsubscribe on destroy', () => {
    spyOn(component['destroy$'], 'next');
    spyOn(component['destroy$'], 'complete');

    component.ngOnDestroy();

    expect(component['destroy$'].next).toHaveBeenCalled();
    expect(component['destroy$'].complete).toHaveBeenCalled();
  });
});
