import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { ENVIRONMENT } from 'src/app/config/environment.token';
import { BillItemListComponent } from './bill-item-list.component';

describe('BillItemListComponent', () => {
  let component: BillItemListComponent;
  let fixture: ComponentFixture<BillItemListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BillItemListComponent],
      providers: [
        provideHttpClient(),
        { provide: ENVIRONMENT, useValue: { apiUrl: 'http://localhost:5047', production: false } }
      ]
    });
    fixture = TestBed.createComponent(BillItemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
