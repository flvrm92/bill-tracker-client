import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangePasswordComponent } from './change-password.component';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ApplicationService } from 'src/app/core/services/application.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe('ChangePasswordComponent', () => {
  let component: ChangePasswordComponent;
  let fixture: ComponentFixture<ChangePasswordComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let applicationService: jasmine.SpyObj<ApplicationService>;
  let router: Router;

  beforeEach(async () => {
    authService = jasmine.createSpyObj('AuthService', ['changePassword']);
    applicationService = jasmine.createSpyObj('ApplicationService', ['displayMessage']);

    await TestBed.configureTestingModule({
      imports: [ChangePasswordComponent],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: ApplicationService, useValue: applicationService },
        provideHttpClient(),
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ChangePasswordComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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

  it('should validate new password minimum length', () => {
    const passwordControl = component.form.get('newPassword');
    passwordControl?.setValue('short');
    expect(passwordControl?.hasError('minlength')).toBeTruthy();

    passwordControl?.setValue('longpassword');
    expect(passwordControl?.hasError('minlength')).toBeFalsy();
  });

  it('should validate password strength', () => {
    const passwordControl = component.form.get('newPassword');
    passwordControl?.setValue('weakpass');
    expect(passwordControl?.hasError('strongPassword')).toBeTruthy();

    passwordControl?.setValue('StrongP@ss123');
    expect(passwordControl?.hasError('strongPassword')).toBeFalsy();
  });

  it('should validate password match', () => {
    component.form.patchValue({
      newPassword: 'StrongP@ss123',
      confirmNewPassword: 'DifferentPassword'
    });
    expect(component.form.hasError('passwordMismatch')).toBeTruthy();

    component.form.patchValue({
      confirmNewPassword: 'StrongP@ss123'
    });
    expect(component.form.hasError('passwordMismatch')).toBeFalsy();
  });

  it('should not submit invalid form', () => {
    component.submit();
    expect(authService.changePassword).not.toHaveBeenCalled();
    expect(component.form.touched).toBeTruthy();
  });

  it('should prevent double submission', () => {
    component.form.patchValue({
      email: 'test@test.com',
      currentPassword: 'Current123',
      newPassword: 'NewP@ss123',
      confirmNewPassword: 'NewP@ss123'
    });
    component.isSubmitting = true;

    component.submit();

    expect(authService.changePassword).not.toHaveBeenCalled();
  });

  it('should successfully change password', () => {
    authService.changePassword.and.returnValue(of(undefined));

    component.form.patchValue({
      email: 'test@test.com',
      currentPassword: 'OldP@ss123',
      newPassword: 'NewP@ss123',
      confirmNewPassword: 'NewP@ss123'
    });

    component.submit();

    expect(authService.changePassword).toHaveBeenCalledWith({
      email: 'test@test.com',
      currentPassword: 'OldP@ss123',
      newPassword: 'NewP@ss123'
    });
    expect(applicationService.displayMessage).toHaveBeenCalledWith('Password changed');
    expect(component.success).toContain('Password updated successfully');
    expect(component.form.pristine).toBeTruthy();
  });

  it('should handle change password error', () => {
    authService.changePassword.and.returnValue(throwError(() => new Error('Change failed')));

    component.form.patchValue({
      email: 'test@test.com',
      currentPassword: 'WrongOld123',
      newPassword: 'NewP@ss123',
      confirmNewPassword: 'NewP@ss123'
    });

    component.submit();

    expect(component.error).toContain('Could not change the password');
    expect(component.isSubmitting).toBeFalsy();
  });

  it('should clear messages on new submission', () => {
    component.error = 'Previous error';
    component.success = 'Previous success';

    authService.changePassword.and.returnValue(of(undefined));

    component.form.patchValue({
      email: 'test@test.com',
      currentPassword: 'OldP@ss123',
      newPassword: 'NewP@ss123',
      confirmNewPassword: 'NewP@ss123'
    });

    component.submit();

    expect(component.error).toBeNull();
  });

  it('should toggle password visibility flags', () => {
    expect(component.hideCurrent).toBeTruthy();
    expect(component.hideNew).toBeTruthy();
    expect(component.hideConfirm).toBeTruthy();

    component.hideCurrent = false;
    component.hideNew = false;
    component.hideConfirm = false;

    expect(component.hideCurrent).toBeFalsy();
    expect(component.hideNew).toBeFalsy();
    expect(component.hideConfirm).toBeFalsy();
  });
});
