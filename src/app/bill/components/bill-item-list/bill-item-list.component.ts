import {
  AfterViewInit,
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { IBillItem, ICategory, ISubCategory } from 'src/app/core/models';
import { SubCategoryService } from 'src/app/subCategory/services/sub-category.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { AddUpdateBillItemComponent } from '../../pages/add-update-bill-item/add-update-bill-item.component';
import { forkJoin } from 'rxjs';
import { CategoryService } from 'src/app/category/services/category.service';
import { PAGINATOR_DEFAULT_PAGE_SIZE, PAGINATOR_DEFAULT_PAGE_SIZE_OPTIONS } from 'src/app/config';

@Component({
  selector: 'app-bill-item-list',
  templateUrl: './bill-item-list.component.html',
  styleUrls: ['./bill-item-list.component.scss'],
  standalone: false
})
export class BillItemListComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() billItems: IBillItem[] = [];
  @Output() billItemChange = new EventEmitter<IBillItem>();
  @Output() billItemDelete = new EventEmitter<IBillItem>();

  displayedColumns: string[] = ['subcategory', 'category', 'value', 'actions'];

  dataSource = new MatTableDataSource<IBillItem>();
  subCategories: ISubCategory[] = [];
  categoryies: ICategory[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  paginatorPageSize = PAGINATOR_DEFAULT_PAGE_SIZE;
  paginatorPageSizeOptions = PAGINATOR_DEFAULT_PAGE_SIZE_OPTIONS;

  constructor(
    private subCategoryService: SubCategoryService,
    private categoryService: CategoryService,
    private destroyRef: DestroyRef,
    private dialog: MatDialog) { }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator as MatPaginator;
  }

  ngOnInit(): void {
    forkJoin([
      this.subCategoryService.getAll(),
      this.categoryService.getAll()
    ])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([subCategories, categories]) => {
        this.subCategories = subCategories;
        this.categoryies = categories;
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['billItems']) {
      this.updateDataSource();
    }
  }

  edit(billItem: IBillItem) {
    const ref = this.dialog.open<AddUpdateBillItemComponent, IBillItem, IBillItem>(AddUpdateBillItemComponent, {
      width: '50vw',
      data: billItem
    });

    ref.afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(result => {
        if (!result) return;
        this.billItemChange.emit(result);
      });
  }

  delete(billItem: IBillItem) {
    this.billItemDelete.emit(billItem);
  }

  getSubCategoryName(id: string): string {
    return this.subCategories.find(c => c.id === id)?.name ?? '';
  }

  getCategoryName(subCategoryId: string): string {
    const subCategory = this.subCategories.find(sc => sc.id === subCategoryId);
    return this.categoryies.find(c => c.id === subCategory?.categoryId)?.name ?? '';
  }

  private updateDataSource(): void {
    this.dataSource.data = this.billItems.sort((a, b) => {
      const va = a.value ?? 0;
      const vb = b.value ?? 0;
      return vb - va;
    });
  }
}
