import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ICategory } from 'src/app/core/models/ICategory';
import { MatTableDataSource } from '@angular/material/table';
import { CategoryService } from '../../services/category.service';
import { Router } from '@angular/router';
import { AlertIcon, AlertService } from 'src/app/shared/services/alert.service';
import { PAGINATOR_DEFAULT_PAGE_SIZE, PAGINATOR_DEFAULT_PAGE_SIZE_OPTIONS } from 'src/app/config';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule
  ]
})
export class CategoryListComponent implements OnInit {

  @Input() categories: ICategory[] = [];

  displayedColumns: string[] = ['name', 'actions'];

  dataSource = new MatTableDataSource<ICategory>();

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  paginatorPageSize = PAGINATOR_DEFAULT_PAGE_SIZE;
  paginatorPageSizeOptions = PAGINATOR_DEFAULT_PAGE_SIZE_OPTIONS;

  constructor(private categoryService: CategoryService,
    private router: Router,
    private alertService: AlertService) { }

  ngOnInit(): void {
    this.dataSource.data = this.categories;
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator as MatPaginator;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['categories']) {
      this.updateDataSource();
    }
  }

  edit(category: ICategory) {
    this.router.navigate(['category', category.id]);
  }

  async delete(category: ICategory) {
    const confirmRemove = await this.alertService.yesOrNoAlert({
      title: 'Delete category',
      text: `Are you sure you want to delete category ${category.name}?`,
      icon: AlertIcon.Warning,
    });

    if (confirmRemove) {
      this.categoryService.delete(category.id)
        .subscribe(() => {
          this.alertService.toastAlert({
            title: 'Category deleted',
            text: `Category ${category.name} was deleted successfully.`,
            icon: AlertIcon.Success,
          });
          this.categories = this.categories.filter(c => c.id !== category.id);
          this.updateDataSource();
        });
    }
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  private updateDataSource(): void {
    this.dataSource.data = this.categories;
  }
}
