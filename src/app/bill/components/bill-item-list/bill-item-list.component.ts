import {
  AfterViewInit,
  Component,
  DestroyRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { IBillItem, ISubCategory } from 'src/app/core/models';
import { SubCategoryService } from 'src/app/subCategory/services/sub-category.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { AddUpdateBillItemComponent } from '../../pages/add-update-bill-item/add-update-bill-item.component';
import { CreateEditBillComponent } from '../../pages/create-edit-bill/create-edit-bill.component';

@Component({
  selector: 'app-bill-item-list',
  templateUrl: './bill-item-list.component.html',
  styleUrls: ['./bill-item-list.component.scss']
})
export class BillItemListComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() billItems: IBillItem[] = [];

  displayedColumns: string[] = ['description', 'subcategory', 'value', 'actions'];

  dataSource = new MatTableDataSource<IBillItem>();
  subCategories: ISubCategory[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  constructor(
    private subCategoryService: SubCategoryService,
    private destroyRef: DestroyRef,
    private dialog: MatDialog) { }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator as MatPaginator;
  }

  ngOnInit(): void {
    this.subCategoryService.getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(subCategories => this.subCategories = subCategories);
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



  }

  delete(billItem: IBillItem) {
    console.log('Delete', billItem);
  }

  getCategoryName(id: string): string {
    return this.subCategories.find(c => c.id === id)?.name ?? '';
  }

  private updateDataSource(): void {
    this.dataSource.data = this.billItems;
  }
}
