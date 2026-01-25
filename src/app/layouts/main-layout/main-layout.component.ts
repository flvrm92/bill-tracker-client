import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NavigationComponent } from '../../core/components/navigation/navigation.component';
import { ThemeToggleComponent } from '../../components/theme-toggle/theme-toggle.component';
import { ProgressBarComponent } from '../../core/components/progress-bar/progress-bar.component';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
  imports: [
    RouterOutlet,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    NavigationComponent,
    ThemeToggleComponent,
    ProgressBarComponent
  ]
})
export class MainLayoutComponent { }
