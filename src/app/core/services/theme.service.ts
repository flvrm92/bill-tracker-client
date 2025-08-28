import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'selected-theme';
  private themeSubject = new BehaviorSubject<string>('light');

  theme$: Observable<string> = this.themeSubject.asObservable();

  constructor() {
    const savedTheme = localStorage.getItem(this.THEME_KEY) || 'light';
    this.setTheme(savedTheme);
  }

  getCurrentTheme(): string {
    return this.themeSubject.value;
  }

  setTheme(theme: string): void {
    this.themeSubject.next(theme);
    localStorage.setItem(this.THEME_KEY, theme);
    this.updateBodyClass(theme);
  }

  toggleTheme(): void {
    const currentTheme = this.getCurrentTheme();
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  private updateBodyClass(theme: string): void {
    const body = document.body;
    body.classList.remove('light-theme', 'dark-theme');
    body.classList.add(`${theme}-theme`);
  }
}
