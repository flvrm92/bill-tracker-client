import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { IBIllDto } from 'src/app/core/models';
import { BillService } from '../../services/bill.service';

@Component({
  selector: 'app-landing-bill',
  templateUrl: './landing-bill.component.html',
  styleUrls: ['./landing-bill.component.scss']
})
export class LandingBillComponent implements OnInit, OnDestroy {

  bills: IBIllDto[] = [];
  private destroy$ = new Subject();

  constructor(private billService: BillService) { }

  ngOnInit(): void {
    this.billService.getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe(bills => this.bills = bills);
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

}
