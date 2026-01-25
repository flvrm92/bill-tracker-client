import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;
  let mockLocalStorage: { [key: string]: string };

  beforeEach(() => {
    mockLocalStorage = {};

    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      return mockLocalStorage[key] || null;
    });

    spyOn(localStorage, 'setItem').and.callFake((key: string, value: string) => {
      mockLocalStorage[key] = value;
    });

    // Mock document.body
    spyOn(document.body.classList, 'remove');
    spyOn(document.body.classList, 'add');

    TestBed.configureTestingModule({
      providers: [ThemeService]
    });
    service = TestBed.inject(ThemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should default to light theme', () => {
    expect(service.getCurrentTheme()).toBe('light');
  });

  it('should restore saved theme from localStorage', () => {
    mockLocalStorage['selected-theme'] = 'dark';
    const newService = new ThemeService();
    expect(newService.getCurrentTheme()).toBe('dark');
  });

  describe('setTheme', () => {
    it('should update current theme', () => {
      service.setTheme('dark');
      expect(service.getCurrentTheme()).toBe('dark');
    });

    it('should save theme to localStorage', () => {
      service.setTheme('dark');
      expect(localStorage.setItem).toHaveBeenCalledWith('selected-theme', 'dark');
    });

    it('should update body class', () => {
      service.setTheme('dark');
      expect(document.body.classList.remove).toHaveBeenCalledWith('light-theme', 'dark-theme');
      expect(document.body.classList.add).toHaveBeenCalledWith('dark-theme');
    });

    it('should emit theme change via observable', (done) => {
      service.theme$.subscribe(theme => {
        if (theme === 'dark') {
          expect(theme).toBe('dark');
          done();
        }
      });
      service.setTheme('dark');
    });
  });

  describe('toggleTheme', () => {
    it('should toggle from light to dark', () => {
      service.setTheme('light');
      service.toggleTheme();
      expect(service.getCurrentTheme()).toBe('dark');
    });

    it('should toggle from dark to light', () => {
      service.setTheme('dark');
      service.toggleTheme();
      expect(service.getCurrentTheme()).toBe('light');
    });
  });

  describe('getCurrentTheme', () => {
    it('should return the current theme', () => {
      service.setTheme('dark');
      expect(service.getCurrentTheme()).toBe('dark');
    });
  });
});
