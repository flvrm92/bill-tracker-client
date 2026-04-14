import { Component } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ISubCategoryDto } from 'src/app/core/models/ISubCategory';
import { SubCategoryService } from '../../services/sub-category.service';
import { SubCategoryListComponent } from '../../components/subcategory-list/subcategory-list.component';

@Component({
  selector: 'app-landing-subcategory',
  templateUrl: './landing-subcategory.component.html',
  styleUrl: './landing-subcategory.component.scss',
  imports: [MatButtonModule, MatIconModule, RouterLink, SubCategoryListComponent]
})
export class LandingSubCategoryComponent {

  subcategories: ISubCategoryDto[] = []
  private destroy$ = new Subject();

  constructor(private subCategoryService: SubCategoryService) {

  }

  ngOnInit(): void {
    this.subCategoryService.getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe(sub => this.subcategories = sub);
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
