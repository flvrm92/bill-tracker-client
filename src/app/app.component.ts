import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false
})
export class AppComponent {
  title = 'BillTracker-client';
  constructor(private router: Router) { }

  get isLoginRoute(): boolean {
    return this.router.url.startsWith('/login') || this.router.url.startsWith('/change-password');
  }
}
