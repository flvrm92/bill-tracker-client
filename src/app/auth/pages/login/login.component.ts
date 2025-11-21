import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ApplicationService } from 'src/app/core/services/application.service';
import { AuthStateService } from '../../../shared/services/auth-state.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: false
})
export class LoginComponent {
  hidePassword = true;
  error: string | null = null;
  isSubmitting = false;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private authState: AuthStateService,
    private app: ApplicationService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  submit() {
    this.error = null;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    const email = (this.form.value.email ?? '').toString().trim();
    const password = this.form.value.password ?? '';

    this.authService.login({ email, password }).pipe(finalize(() => {
      this.isSubmitting = false;
    })).subscribe({
      next: (resp) => {
        if (!resp || !resp.token || !resp.expiresAtUtc) {
          this.error = 'Invalid response from server.';
          return;
        }
        this.authState.setSession(resp);
        const redirectUrl = this.safeRedirect(this.route.snapshot.queryParamMap.get('redirectUrl'));
        this.router.navigateByUrl(redirectUrl ?? '/home');
        this.app.displayMessage('Logged in successfully');
      },
      error: () => {
        this.error = 'Invalid email or password';
      }
    });
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  private safeRedirect(url: string | null): string | null {
    if (!url) return null;
    if (url.startsWith('/') && !url.startsWith('//') && !url.startsWith('/http')) {
      return url;
    }
    return null;
  }
}
