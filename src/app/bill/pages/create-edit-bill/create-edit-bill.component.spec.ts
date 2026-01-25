import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { ENVIRONMENT } from 'src/app/config/environment.token';
import { CreateEditBillComponent } from './create-edit-bill.component';

describe('CreateEditBillComponent', () => {
  let component: CreateEditBillComponent;
  let fixture: ComponentFixture<CreateEditBillComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CreateEditBillComponent],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        { provide: ENVIRONMENT, useValue: { apiUrl: 'http://localhost:5047', production: false } }
      ]
    });
    fixture = TestBed.createComponent(CreateEditBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
