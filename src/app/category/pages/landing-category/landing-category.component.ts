import { Component, OnDestroy, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { Subject, takeUntil } from 'rxjs';
import { ICategory } from 'src/app/core/models/ICategory';

@Component({
    selector: 'app-landing-category',
    templateUrl: './landing-category.component.html',
    styleUrls: ['./landing-category.component.scss'],
    standalone: false
})
export class LandingCategoryComponent implements OnInit, OnDestroy {

  categories: ICategory[] = [];
  private destroy$ = new Subject();

  constructor(private categoryService: CategoryService) {

  }

  ngOnInit(): void {
    this.categoryService.getAll()
    .pipe(takeUntil(this.destroy$))
    .subscribe(categories => this.categories = categories);
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

}
