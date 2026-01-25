import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { ENVIRONMENT } from 'src/app/config/environment.token';
import { LandingSubCategoryComponent } from './landing-subcategory.component';

describe('LandingSubCategoryComponent', () => {
  let component: LandingSubCategoryComponent;
  let fixture: ComponentFixture<LandingSubCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingSubCategoryComponent],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        { provide: ENVIRONMENT, useValue: { apiUrl: 'http://localhost:5047', production: false } }
      ]
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
