import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ENVIRONMENT } from 'src/app/config/environment.token';
import { AuthService, AuthResponse } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  const mockEnv = { apiUrl: 'http://localhost:5047', production: false };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ENVIRONMENT, useValue: mockEnv }
      ]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should authenticate user and return token', () => {
      const credentials = { email: 'test@test.com', password: 'password123' };
      const mockResponse: AuthResponse = {
        token: 'test-token',
        expiresAtUtc: new Date('2026-12-31T23:59:59Z')
      };

      service.login(credentials).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(response.token).toBe('test-token');
      });

      const req = httpMock.expectOne(`${mockEnv.apiUrl}/auth/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(credentials);
      req.flush(mockResponse);
    });

    it('should handle login error', (done) => {
      const credentials = { email: 'test@test.com', password: 'wrong' };

      service.login(credentials).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(401);
          done();
        }
      });

      const req = httpMock.expectOne(`${mockEnv.apiUrl}/auth/login`);
      req.flush({ message: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('changePassword', () => {
    it('should change password successfully', () => {
      const changeRequest = {
        email: 'test@test.com',
        currentPassword: 'old',
        newPassword: 'new'
      };

      service.changePassword(changeRequest).subscribe(response => {
        expect(response).toBeNull();
      });

      const req = httpMock.expectOne(`${mockEnv.apiUrl}/auth/change-password`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(changeRequest);
      req.flush(null);
    });

    it('should handle change password error', (done) => {
      const changeRequest = {
        email: 'test@test.com',
        currentPassword: 'wrong',
        newPassword: 'new'
      };

      service.changePassword(changeRequest).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(400);
          done();
        }
      });

      const req = httpMock.expectOne(`${mockEnv.apiUrl}/auth/change-password`);
      req.flush({ message: 'Invalid password' }, { status: 400, statusText: 'Bad Request' });
    });
  });
});
