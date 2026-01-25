import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { CategoryService } from './category.service';
import { ENVIRONMENT } from '../../config/environment.token';
import { ICategory } from 'src/app/core/models/ICategory';

describe('CategoryService', () => {
  let service: CategoryService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:5047';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CategoryService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ENVIRONMENT, useValue: { apiUrl, production: false } }
      ]
    });
    service = TestBed.inject(CategoryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should fetch all categories', (done) => {
      const mockCategories: ICategory[] = [
        { id: '1', name: 'Category 1' },
        { id: '2', name: 'Category 2' }
      ];

      service.getAll().subscribe(categories => {
        expect(categories.length).toBe(2);
        expect(categories).toEqual(mockCategories);
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/category`);
      expect(req.request.method).toBe('GET');
      req.flush(mockCategories);
    });

    it('should cache results with ReplaySubject', (done) => {
      const mockCategories: ICategory[] = [
        { id: '1', name: 'Category 1' }
      ];

      // First call
      service.getAll().subscribe();
      const req1 = httpMock.expectOne(`${apiUrl}/category`);
      req1.flush(mockCategories);

      // Second call should not make HTTP request due to caching
      service.getAll().subscribe(categories => {
        expect(categories).toEqual(mockCategories);
        done();
      });

      // Verify no additional HTTP requests were made
      httpMock.expectNone(`${apiUrl}/category`);
    });
  });

  describe('getById', () => {
    it('should fetch category by id', (done) => {
      const mockCategory: ICategory = { id: '1', name: 'Category 1' };

      service.getById('1').subscribe(category => {
        expect(category).toEqual(mockCategory);
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/category/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockCategory);
    });
  });

  describe('post', () => {
    it('should create new category', (done) => {
      const newCategory: ICategory = { id: '', name: 'New Category' };

      service.post(newCategory).subscribe(category => {
        expect(category.name).toBe('New Category');
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/category`);
      expect(req.request.method).toBe('POST');
      req.flush({ ...newCategory, id: '3' });
    });
  });

  describe('put', () => {
    it('should update existing category', (done) => {
      const updatedCategory: ICategory = { id: '1', name: 'Updated Category' };

      service.put(updatedCategory).subscribe(category => {
        expect(category).toEqual(updatedCategory);
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/category/1`);
      expect(req.request.method).toBe('PUT');
      req.flush(updatedCategory);
    });
  });

  describe('delete', () => {
    it('should delete category', (done) => {
      const deletedCategory: ICategory = { id: '1', name: 'Category 1' };

      service.delete('1').subscribe(category => {
        expect(category).toEqual(deletedCategory);
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/category/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(deletedCategory);
    });
  });
});
