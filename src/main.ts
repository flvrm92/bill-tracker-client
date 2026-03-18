import { provideZoneChangeDetection } from "@angular/core";
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { authInterceptor } from './app/core/services/auth.interceptor';
import { progressBarInterceptor } from './app/core/services/progress-bar.interceptor';
import { ApplicationService } from './app/core/services/application.service';
import { ENVIRONMENT } from './app/config/environment.token';
import { environment } from './environments/environment';

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection(),provideRouter(routes),
    provideAnimations(),
    provideHttpClient(
      withInterceptors([progressBarInterceptor, authInterceptor])
    ),
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' }
    },
    {
      provide: ENVIRONMENT,
      useValue: environment
    },
    ApplicationService
  ]
}).catch(err => console.error(err));
