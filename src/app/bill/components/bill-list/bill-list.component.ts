import { Component, DestroyRef, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { IBIllDto, ISubCategory } from 'src/app/core/models';
import { BillService } from '../../services/bill.service';
import { Router } from '@angular/router';
import { AlertIcon, AlertService } from 'src/app/shared/services/alert.service';
import { MatPaginator } from '@angular/material/paginator';

@Component({
    selector: 'app-bill-list',
    templateUrl: './bill-list.component.html',
    styleUrls: ['./bill-list.component.scss'],
    standalone: false
})
export class BillListComponent implements OnInit {
  @Input() bills: IBIllDto[] = [];

  displayedColumns: string[] = ['payment', 'total', 'totalIncoming', 'actions'];

  dataSource = new MatTableDataSource<IBIllDto>();

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  constructor(private billService: BillService,
    private router: Router,
    private alertService: AlertService) { }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator as MatPaginator;
  }

  ngOnInit(): void {
    this.dataSource.data = this.bills;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['bills']) {
      this.updateDataSource();
    }
  }

  edit(bill: IBIllDto) {
    this.router.navigate(['bill', bill.id]);
  }

  calcTotal(bill: IBIllDto): number {
    return bill.billItems?.reduce((acc, item) => acc + item.value, 0) ?? 0;
  }

  async delete(bill: IBIllDto) {
    const confirmRemove = await this.alertService.yesOrNoAlert({
      title: 'Delete bill',
      text: `Are you sure you want to delete bill ${bill.id}?`,
      icon: AlertIcon.Warning,
    });

    if (confirmRemove && bill.id) {
      this.billService.delete(bill.id)
        .subscribe({
          next: (result) => this.onSuccessDelete(result),
          error: (error) => {
            console.error(error);
            this.onFailDelete(bill);
          }
        });
    }
  }

  private onSuccessDelete(bill: IBIllDto): void {
    this.alertService.toastAlert({
      title: 'Bill deleted',
      text: `Bill ${bill.id} was deleted successfully.`,
      icon: AlertIcon.Success,
    });
    this.bills = this.bills.filter(c => c.id !== bill.id);
    this.updateDataSource();
  }

  private onFailDelete(bill: IBIllDto): void {
    this.alertService.toastAlert({
      title: 'Bill delete failed',
      text: `Bill ${bill.id} could not be deleted. Please try again later.`,
      icon: AlertIcon.Error,
    });
  }

  private updateDataSource(): void {
    this.dataSource.data = this.bills;
  }
}
