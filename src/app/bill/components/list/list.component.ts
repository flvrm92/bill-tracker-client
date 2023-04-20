import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { BillService } from '../../services/bill.service';
import { IBill } from 'src/app/core/models/IBill';
import { MatTableDataSource } from '@angular/material/table';
import { AlertIcon, AlertService } from 'src/app/shared/services/alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnChanges {

  @Input() bills: IBill[] = [];

  displayedColumns: string[] = ['payment', 'totalIncoming', 'total', 'actions'];

  dataSource = new MatTableDataSource<IBill>();

  constructor(private billService: BillService,
    private router: Router,
    private alertService: AlertService) {
  }

  ngOnInit(): void {
    this.dataSource.data = this.bills;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['bills']) {
      this.updateDataSource();
    }
  }

  edit(bill: IBill) {
    this.router.navigate(['bill', 'create-edit', bill.id]);
  }

  delete(bill: IBill) {
    this.billService.delete(bill.id)
      .subscribe(() => {
        this.alertService.toastAlert({
          title: 'Bill deleted',
          text: `Bill ${bill.payment} was deleted successfully.`,
          icon: AlertIcon.Success,
        });
        this.bills = this.bills.filter(c => c.id !== bill.id);
        this.updateDataSource();
      });
  }

  private updateDataSource(): void {
    this.dataSource.data = this.bills;
  }
}
