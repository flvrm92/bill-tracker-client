import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { ApplicationService } from 'src/app/core/services/application.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { STRONG_PASSWORD_HINT, passwordMatchValidator, strongPasswordValidator } from 'src/app/shared/utilities/password-validators';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  standalone: false
})
export class ChangePasswordComponent {
  hideCurrent = true;
  hideNew = true;
  hideConfirm = true;
  isSubmitting = false;
  error: string | null = null;
  success: string | null = null;
  readonly strongPasswordHint = STRONG_PASSWORD_HINT;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(8), strongPasswordValidator()]],
    confirmNewPassword: ['', [Validators.required]]
  }, { validators: [passwordMatchValidator('newPassword', 'confirmNewPassword')] });

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private app: ApplicationService,
    private router: Router
  ) { }

  submit(): void {
    this.error = null;
    this.success = null;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.isSubmitting) {
      return;
    }

    const email = (this.form.value.email ?? '').toString().trim();
    const currentPassword = this.form.value.currentPassword ?? '';
    const newPassword = this.form.value.newPassword ?? '';

    this.isSubmitting = true;
    this.auth.changePassword({ email, currentPassword, newPassword }).pipe(finalize(() => {
      this.isSubmitting = false;
    })).subscribe({
      next: () => {
        this.success = 'Password updated successfully. Use your new password to sign in.';
        this.app.displayMessage('Password changed');
        this.form.reset();
      },
      error: () => {
        this.error = 'Could not change the password. Check your current password and try again.';
      }
    });
  }

  get passwordMismatch(): boolean {
    const confirmControl = this.form.controls.confirmNewPassword;
    return this.form.hasError('passwordMismatch') && !!confirmControl && confirmControl.touched;
  }

  toggle(field: 'hideCurrent' | 'hideNew' | 'hideConfirm'): void {
    this[field] = !this[field];
  }

  backToLogin(): void {
    this.router.navigate(['/login']);
  }
}