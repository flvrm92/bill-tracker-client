import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LandingCategoryComponent } from './landing-category.component';
import { CategoryService } from '../../services/category.service';
import { of } from 'rxjs';
import { ICategory } from 'src/app/core/models/ICategory';
import { provideRouter } from '@angular/router';

describe('LandingCategoryComponent', () => {
  let component: LandingCategoryComponent;
  let fixture: ComponentFixture<LandingCategoryComponent>;
  let categoryService: jasmine.SpyObj<CategoryService>;

  const mockCategories: ICategory[] = [
    { id: '1', name: 'Groceries' },
    { id: '2', name: 'Utilities' },
    { id: '3', name: 'Entertainment' }
  ];

  beforeEach(async () => {
    categoryService = jasmine.createSpyObj('CategoryService', ['getAll']);
    categoryService.getAll.and.returnValue(of(mockCategories));

    await TestBed.configureTestingModule({
      imports: [LandingCategoryComponent],
      providers: [
        { provide: CategoryService, useValue: categoryService },
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LandingCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load categories on init', () => {
    expect(categoryService.getAll).toHaveBeenCalled();
    expect(component.categories).toEqual(mockCategories);
  });

  it('should have empty categories initially before service call', () => {
    const newComponent = new LandingCategoryComponent(categoryService);
    expect(newComponent.categories).toEqual([]);
  });

  it('should unsubscribe on destroy', () => {
    spyOn(component['destroy$'], 'next');
    spyOn(component['destroy$'], 'complete');

    component.ngOnDestroy();

    expect(component['destroy$'].next).toHaveBeenCalled();
    expect(component['destroy$'].complete).toHaveBeenCalled();
  });
});
