import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { BillService } from './bill.service';
import { ENVIRONMENT } from '../../config/environment.token';
import { IBIllDto, IBill } from 'src/app/core/models/IBill';

describe('BillService', () => {
  let service: BillService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:5047';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BillService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ENVIRONMENT, useValue: { apiUrl, production: false } }
      ]
    });
    service = TestBed.inject(BillService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should fetch all bills', (done) => {
      const mockBills: IBIllDto[] = [
        { id: '1', paymentMonth: new Date().toISOString(), total: 100, totalIncoming: 0, billItems: [] },
        { id: '2', paymentMonth: new Date().toISOString(), total: 200, totalIncoming: 0, billItems: [] }
      ];

      service.getAll().subscribe(bills => {
        expect(bills.length).toBe(2);
        expect(bills).toEqual(mockBills);
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/bill`);
      expect(req.request.method).toBe('GET');
      req.flush(mockBills);
    });
  });

  describe('getById', () => {
    it('should fetch bill by id', (done) => {
      const mockBill: IBill = {
        id: '1',
        paymentMonth: new Date(),
        totalIncoming: 1000,
        billItems: []
      };

      service.getById('1').subscribe(bill => {
        expect(bill.id).toEqual(mockBill.id);
        expect(bill.totalIncoming).toEqual(mockBill.totalIncoming);
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/bill/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockBill);
    });
  });

  describe('post', () => {
    it('should create new bill', (done) => {
      const newBill: IBIllDto = {
        paymentMonth: new Date().toISOString(),
        total: 150,
        totalIncoming: 0,
        billItems: []
      };

      service.post(newBill).subscribe(bill => {
        expect(bill).toEqual(newBill);
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/bill`);
      expect(req.request.method).toBe('POST');
      req.flush(newBill);
    });
  });

  describe('put', () => {
    it('should update existing bill', (done) => {
      const updatedBill: IBIllDto = {
        id: '1',
        paymentMonth: new Date().toISOString(),
        total: 250,
        totalIncoming: 0,
        billItems: []
      };

      service.put(updatedBill).subscribe(bill => {
        expect(bill).toEqual(updatedBill);
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/bill/1`);
      expect(req.request.method).toBe('PUT');
      req.flush(updatedBill);
    });
  });

  describe('delete', () => {
    it('should delete bill', (done) => {
      const deletedBill: IBIllDto = {
        id: '1',
        paymentMonth: new Date().toISOString(),
        total: 100,
        totalIncoming: 0,
        billItems: []
      };

      service.delete('1').subscribe(bill => {
        expect(bill).toEqual(deletedBill);
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/bill/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush({ data: deletedBill, message: 'Success', success: true });
    });
  });

  describe('copy', () => {
    it('should copy bill', (done) => {
      const copiedBill: IBIllDto = {
        id: '2',
        paymentMonth: new Date().toISOString(),
        total: 100,
        totalIncoming: 0,
        billItems: []
      };

      service.copy('1').subscribe(bill => {
        expect(bill).toEqual(copiedBill);
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/bill/copy/1`);
      expect(req.request.method).toBe('POST');
      req.flush(copiedBill);
    });
  });
});
