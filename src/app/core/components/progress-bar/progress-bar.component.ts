import { ChangeDetectorRef, Component, DestroyRef } from '@angular/core';
import { ApplicationService } from '../../services/application.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrl: './progress-bar.component.scss',
  standalone: false
})
export class ProgressBarComponent {
  loading: boolean = false;

  constructor(private applicationService: ApplicationService,
    private destroyRef: DestroyRef,
    private cdr: ChangeDetectorRef
  ) {
    this.applicationService.loading$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((loading: boolean) => {
        this.loading = loading
        this.cdr.detectChanges();
      });
  }
}
