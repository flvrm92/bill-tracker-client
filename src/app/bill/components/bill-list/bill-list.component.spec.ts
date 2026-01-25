import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { ENVIRONMENT } from 'src/app/config/environment.token';
import { BillListComponent } from './bill-list.component';

describe('BillListComponent', () => {
  let component: BillListComponent;
  let fixture: ComponentFixture<BillListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BillListComponent],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        { provide: ENVIRONMENT, useValue: { apiUrl: 'http://localhost:5047', production: false } }
      ]
    });
    fixture = TestBed.createComponent(BillListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
