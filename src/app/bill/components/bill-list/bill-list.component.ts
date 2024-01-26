import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { IBIllDto } from 'src/app/core/models';
import { BillService } from '../../services/bill.service';
import { Router } from '@angular/router';
import { AlertIcon, AlertService } from 'src/app/shared/services/alert.service';

@Component({
  selector: 'app-bill-list',
  templateUrl: './bill-list.component.html',
  styleUrls: ['./bill-list.component.scss']
})
export class BillListComponent implements OnInit {
  @Input() bills: IBIllDto[] = [];

  displayedColumns: string[] = ['id', 'payment', 'total', 'totalIncoming', 'actions'];

  dataSource = new MatTableDataSource<IBIllDto>();

  constructor(private billService: BillService,
    private router: Router,
    private alertService: AlertService) { }

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

  async delete(bill: IBIllDto) {
    const confirmRemove = await this.alertService.yesOrNoAlert({
      title: 'Delete bill',
      text: `Are you sure you want to delete bill ${bill.id}?`,
      icon: AlertIcon.Warning,
    });

    if (confirmRemove) {
      this.billService.delete(bill.id)
        .subscribe(() => {
          this.alertService.toastAlert({
            title: 'Bill deleted',
            text: `Bill ${bill.id} was deleted successfully.`,
          });
          this.bills = this.bills.filter(c => c.id !== bill.id);
          this.updateDataSource();
        });
    }
  }

  private updateDataSource(): void {
    this.dataSource.data = this.bills;
  }
}
