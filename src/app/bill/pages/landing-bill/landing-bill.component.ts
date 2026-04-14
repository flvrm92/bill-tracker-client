import { Component, DestroyRef, OnInit } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IBIllDto, ISubCategory } from 'src/app/core/models';
import { BillService } from '../../services/bill.service';
import { BillListComponent } from '../../components/bill-list/bill-list.component';

@Component({
  selector: 'app-landing-bill',
  templateUrl: './landing-bill.component.html',
  styleUrls: ['./landing-bill.component.scss'],
  imports: [MatButtonModule, MatIconModule, RouterLink, BillListComponent]
})
export class LandingBillComponent implements OnInit {

  bills: IBIllDto[] = [];

  subCategories: ISubCategory[] = [];

  constructor(
    private billService: BillService,
    private destroyRef: DestroyRef) { }

  ngOnInit(): void {
    this.billService.getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(bills => this.bills = bills);
  }
}
