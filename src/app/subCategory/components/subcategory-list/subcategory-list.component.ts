import { Component, Input, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { AlertIcon, AlertService } from 'src/app/shared/services/alert.service';
import { SubCategoryService } from '../../services/sub-category.service';
import { ISubCategoryDto } from 'src/app/core/models/ISubCategory';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-subcategory-list',
  templateUrl: './subcategory-list.component.html',
  styleUrls: ['./subcategory-list.component.scss']
})
export class SubCategoryListComponent {

  @Input() subcategories: ISubCategoryDto[] = [];

  displayedColumns: string[] = ['name', 'category', 'recurring', 'actions'];

  dataSource = new MatTableDataSource<ISubCategoryDto>();

  constructor(
    private subCategoryService: SubCategoryService,
    private router: Router,
    private alertService: AlertService) { }

  ngOnInit(): void {
    this.dataSource.data = this.subcategories;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['subcategories']) {
      this.updateDataSource();
    }
  }

  edit(subCategory: ISubCategoryDto) {
    this.router.navigate(['subCategory', subCategory.id]);
  }

  async delete(subCategory: ISubCategoryDto) {
    const confirmRemove = await this.alertService.yesOrNoAlert({
      title: 'Delete category',
      text: `Are you sure you want to delete category ${subCategory.name}?`,
      icon: AlertIcon.Warning,
    });

    if (confirmRemove) {
      this.subCategoryService.delete(subCategory.id)
        .subscribe(() => {
          this.alertService.toastAlert({
            title: 'subCategory deleted',
            text: `subCategory ${subCategory.name} was deleted successfully.`,
            icon: AlertIcon.Success,
          });
          this.subcategories = this.subcategories.filter(c => c.id !== subCategory.id);
          this.updateDataSource();
        });
    }
  }

  private updateDataSource(): void {
    this.dataSource.data = this.subcategories;
  }
}
