import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from 'src/app/shared/services/auth.service';
import { AuthStateService } from 'src/app/shared/services/auth-state.service';
import { ApplicationService } from 'src/app/core/services/application.service';
import { ThemeService } from 'src/app/core/services/theme.service';
import { Router, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let authStateService: jasmine.SpyObj<AuthStateService>;
  let applicationService: jasmine.SpyObj<ApplicationService>;
  let themeService: jasmine.SpyObj<ThemeService>;
  let router: Router;

  beforeEach(async () => {
    authService = jasmine.createSpyObj('AuthService', ['login']);
    authStateService = jasmine.createSpyObj('AuthStateService', ['setSession']);
    applicationService = jasmine.createSpyObj('ApplicationService', ['displayMessage']);
    themeService = jasmine.createSpyObj('ThemeService', ['setTheme', 'getCurrentTheme']);

    themeService.getCurrentTheme.and.returnValue('light');

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: AuthStateService, useValue: authStateService },
        { provide: ApplicationService, useValue: applicationService },
        { provide: ThemeService, useValue: themeService },
        { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: { get: () => null } } } },
        { provide: PLATFORM_ID, useValue: 'browser' },
        provideHttpClient(),
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with theme', () => {
    expect(themeService.getCurrentTheme).toHaveBeenCalled();
    expect(themeService.setTheme).toHaveBeenCalledWith('light');
  });

  it('should have invalid form when empty', () => {
    expect(component.form.valid).toBeFalsy();
  });

  it('should validate email format', () => {
    const emailControl = component.form.get('email');
    emailControl?.setValue('invalid-email');
    expect(emailControl?.hasError('email')).toBeTruthy();

    emailControl?.setValue('valid@email.com');
    expect(emailControl?.hasError('email')).toBeFalsy();
  });

  it('should validate password minimum length', () => {
    const passwordControl = component.form.get('password');
    passwordControl?.setValue('12345');
    expect(passwordControl?.hasError('minlength')).toBeTruthy();

    passwordControl?.setValue('123456');
    expect(passwordControl?.hasError('minlength')).toBeFalsy();
  });

  it('should not submit invalid form', () => {
    component.submit();
    expect(authService.login).not.toHaveBeenCalled();
    expect(component.form.touched).toBeTruthy();
  });

  it('should prevent double submission', () => {
    component.form.patchValue({ email: 'test@test.com', password: '123456' });
    component.isSubmitting = true;

    component.submit();

    expect(authService.login).not.toHaveBeenCalled();
  });

  it('should handle invalid server response', () => {
    authService.login.and.returnValue(of(null as any));

    component.form.patchValue({
      email: 'test@test.com',
      password: 'password123'
    });

    component.submit();

    expect(component.error).toBe('Invalid response from server.');
    expect(authStateService.setSession).not.toHaveBeenCalled();
  });

  it('should clear error on new submission', () => {
    component.error = 'Previous error';
    component.form.patchValue({
      email: 'test@test.com',
      password: 'password123'
    });

    const mockResponse = {
      token: 'mock-token',
      expiresAtUtc: new Date('2026-12-31T23:59:59Z')
    };
    authService.login.and.returnValue(of(mockResponse));

    component.submit();

    expect(component.error).toBeNull();
  });

  it('should toggle password visibility', () => {
    expect(component.hidePassword).toBeTruthy();
    component.hidePassword = false;
    expect(component.hidePassword).toBeFalsy();
  });
});
