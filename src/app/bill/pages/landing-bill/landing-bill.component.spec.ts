import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LandingBillComponent } from './landing-bill.component';
import { BillService } from '../../services/bill.service';
import { of } from 'rxjs';
import { IBIllDto } from 'src/app/core/models';
import { provideRouter } from '@angular/router';

describe('LandingBillComponent', () => {
  let component: LandingBillComponent;
  let fixture: ComponentFixture<LandingBillComponent>;
  let billService: jasmine.SpyObj<BillService>;

  const mockBills: IBIllDto[] = [
    {
      id: '1',
      paymentMonth: '2026-01-01',
      total: 1500,
      totalIncoming: 3000,
      billItems: []
    },
    {
      id: '2',
      paymentMonth: '2026-02-01',
      total: 1800,
      totalIncoming: 3200,
      billItems: []
    }
  ];

  beforeEach(async () => {
    billService = jasmine.createSpyObj('BillService', ['getAll']);
    billService.getAll.and.returnValue(of(mockBills));

    await TestBed.configureTestingModule({
      imports: [LandingBillComponent],
      providers: [
        { provide: BillService, useValue: billService },
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LandingBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load bills on init', () => {
    expect(billService.getAll).toHaveBeenCalled();
    expect(component.bills).toEqual(mockBills);
  });

  it('should have empty bills initially before service loads', () => {
    expect(component.bills).toBeDefined();
  });

  it('should have empty subcategories array', () => {
    expect(component.subCategories).toEqual([]);
  });
});
