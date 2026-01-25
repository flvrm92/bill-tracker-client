import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProgressBarComponent } from '../../core/components/progress-bar/progress-bar.component';

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.scss'],
  imports: [RouterOutlet, ProgressBarComponent]
})
export class AuthLayoutComponent { }
