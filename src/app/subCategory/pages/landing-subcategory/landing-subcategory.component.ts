import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ISubCategoryDto } from 'src/app/core/models/ISubCategory';
import { SubCategoryService } from '../../services/sub-category.service';

@Component({
    selector: 'app-landing-subcategory',
    templateUrl: './landing-subcategory.component.html',
    styleUrls: ['./landing-subcategory.component.scss'],
    standalone: false
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
