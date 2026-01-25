import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { ENVIRONMENT } from 'src/app/config/environment.token';
import { LandingBillComponent } from './landing-bill.component';

describe('LandingBillComponent', () => {
  let component: LandingBillComponent;
  let fixture: ComponentFixture<LandingBillComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LandingBillComponent],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        { provide: ENVIRONMENT, useValue: { apiUrl: 'http://localhost:5047', production: false } }
      ]
    });
    fixture = TestBed.createComponent(LandingBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
