import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ICategory } from 'src/app/core/models/ICategory';
import { MatTableDataSource } from '@angular/material/table';
import { CategoryService } from '../../services/category.service';
import { Router } from '@angular/router';
import { AlertIcon, AlertService } from 'src/app/shared/services/alert.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  @Input() categories: ICategory[] = [];

  displayedColumns: string[] = ['name', 'actions'];

  dataSource = new MatTableDataSource<ICategory>();

  constructor(private categoryService: CategoryService,
    private router: Router,
    private alertService: AlertService) { }

  ngOnInit(): void {
    this.dataSource.data = this.categories;
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

  private updateDataSource(): void {
    this.dataSource.data = this.categories;
  }
}
