import { Component, OnDestroy, OnInit } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { Subject, takeUntil } from 'rxjs';
import { ICategory } from 'src/app/core/models/ICategory';
import { CategoryListComponent } from '../../components/category-list/category-list.component';

@Component({
  selector: 'app-landing-category',
  templateUrl: './landing-category.component.html',
  styleUrls: ['./landing-category.component.scss'],
  imports: [MatButtonModule, MatIconModule, RouterLink, CategoryListComponent]
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
