import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { ENVIRONMENT } from 'src/app/config/environment.token';
import { LandingCategoryComponent } from './landing-category.component';

describe('LandingCategoryComponent', () => {
  let component: LandingCategoryComponent;
  let fixture: ComponentFixture<LandingCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingCategoryComponent],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        { provide: ENVIRONMENT, useValue: { apiUrl: 'http://localhost:5047', production: false } }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(LandingCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
