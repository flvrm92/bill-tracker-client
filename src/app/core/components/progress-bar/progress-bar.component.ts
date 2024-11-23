import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ApplicationService } from '../../services/application.service';

@Component({
    selector: 'app-progress-bar',
    templateUrl: './progress-bar.component.html',
    styleUrl: './progress-bar.component.scss',
    standalone: false
})
export class ProgressBarComponent {
  loading$: Observable<boolean>;

  constructor(private applicationService: ApplicationService) {
    this.loading$ = this.applicationService.loading$;
  }
}
