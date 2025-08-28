import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NAVIGATION_CONFIG, NavigationItem } from '../../../config/navigation.config';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule, MatListModule, MatIconModule],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  navigationItems = NAVIGATION_CONFIG;
  currentRoute = '';

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.url;
      });
  }

  ngOnInit(): void {
    this.currentRoute = this.router.url;
  }

  toggleExpansion(item: NavigationItem): void {
    if (item.children) {
      item.expanded = !item.expanded;
    }
  }

  isActive(route: string | undefined): boolean {
    if (!route) return false;
    return this.currentRoute === route || this.currentRoute.startsWith(route + '/');
  }

  hasActiveChild(item: NavigationItem): boolean {
    if (!item.children) return false;
    return item.children.some(child => this.isActive(child.route));
  }
}
