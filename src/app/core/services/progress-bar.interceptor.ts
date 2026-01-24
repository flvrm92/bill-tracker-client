import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { ApplicationService } from './application.service';

export const progressBarInterceptor: HttpInterceptorFn = (req, next) => {
  const applicationService = inject(ApplicationService);

  applicationService.showProgressBar(true);
  return next(req).pipe(
    finalize(() => applicationService.showProgressBar(false))
  );
};