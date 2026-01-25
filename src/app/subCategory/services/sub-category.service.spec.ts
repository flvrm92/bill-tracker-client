import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { SubCategoryService } from './sub-category.service';
import { ENVIRONMENT } from '../../config/environment.token';
import { ISubCategoryDto } from 'src/app/core/models/ISubCategory';

describe('SubCategoryService', () => {
  let service: SubCategoryService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:5047';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SubCategoryService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ENVIRONMENT, useValue: { apiUrl, production: false } }
      ]
    });
    service = TestBed.inject(SubCategoryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should fetch all subcategories', (done) => {
      const mockSubCategories: ISubCategoryDto[] = [
        { id: '1', name: 'SubCat 1', categoryId: 'cat1', category: { id: 'cat1', name: 'Category 1' }, active: true },
        { id: '2', name: 'SubCat 2', categoryId: 'cat2', category: { id: 'cat2', name: 'Category 2' }, active: true }
      ];

      service.getAll().subscribe(subCategories => {
        expect(subCategories.length).toBe(2);
        expect(subCategories).toEqual(mockSubCategories);
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/subcategory`);
      expect(req.request.method).toBe('GET');
      req.flush(mockSubCategories);
    });
  });

  describe('getActive', () => {
    it('should fetch only active subcategories', (done) => {
      const mockActiveSubCategories: ISubCategoryDto[] = [
        { id: '1', name: 'Active SubCat', categoryId: 'cat1', category: { id: 'cat1', name: 'Category 1' }, active: true }
      ];

      service.getActive().subscribe(subCategories => {
        expect(subCategories.length).toBe(1);
        expect(subCategories).toEqual(mockActiveSubCategories);
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/subcategory`);
      expect(req.request.method).toBe('GET');
      req.flush(mockActiveSubCategories);
    });
  });

  describe('getById', () => {
    it('should fetch subcategory by id', (done) => {
      const mockSubCategory: ISubCategoryDto = {
        id: '1',
        name: 'SubCat 1',
        categoryId: 'cat1',
        category: { id: 'cat1', name: 'Category 1' },
        active: true
      };

      service.getById('1').subscribe(subCategory => {
        expect(subCategory).toEqual(mockSubCategory);
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/subcategory/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockSubCategory);
    });
  });

  describe('getAllByCategoryId', () => {
    it('should fetch subcategories by category id', (done) => {
      const mockSubCategories: ISubCategoryDto[] = [
        { id: '1', name: 'SubCat 1', categoryId: 'cat1', category: { id: 'cat1', name: 'Category 1' }, active: true }
      ];

      service.getAllByCategoryId('cat1').subscribe(subCategories => {
        expect(subCategories.length).toBe(1);
        expect(subCategories[0].categoryId).toBe('cat1');
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/subcategory/getbycategoryid/cat1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockSubCategories);
    });
  });

  describe('post', () => {
    it('should create new subcategory', (done) => {
      const newSubCategory: ISubCategoryDto = {
        id: '',
        name: 'New SubCat',
        categoryId: 'cat1',
        category: { id: 'cat1', name: 'Category 1' },
        active: true
      };

      service.post(newSubCategory).subscribe(subCategory => {
        expect(subCategory.name).toBe('New SubCat');
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/subcategory`);
      expect(req.request.method).toBe('POST');
      req.flush({ ...newSubCategory, id: '3' });
    });
  });

  describe('put', () => {
    it('should update existing subcategory', (done) => {
      const updatedSubCategory: ISubCategoryDto = {
        id: '1',
        name: 'Updated SubCat',
        categoryId: 'cat1',
        category: { id: 'cat1', name: 'Category 1' },
        active: true
      };

      service.put(updatedSubCategory).subscribe(subCategory => {
        expect(subCategory).toEqual(updatedSubCategory);
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/subcategory/1`);
      expect(req.request.method).toBe('PUT');
      req.flush(updatedSubCategory);
    });
  });

  describe('delete', () => {
    it('should delete subcategory', (done) => {
      const deletedSubCategory: ISubCategoryDto = {
        id: '1',
        name: 'SubCat 1',
        categoryId: 'cat1',
        category: { id: 'cat1', name: 'Category 1' },
        active: true
      };

      service.delete('1').subscribe(subCategory => {
        expect(subCategory).toEqual(deletedSubCategory);
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/subcategory/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(deletedSubCategory);
    });
  });
});
