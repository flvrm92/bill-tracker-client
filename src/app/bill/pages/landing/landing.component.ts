import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { IBill } from 'src/app/core/models/IBill';
import { BillService } from '../../services/bill.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {

  bills: IBill[] = [];
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
