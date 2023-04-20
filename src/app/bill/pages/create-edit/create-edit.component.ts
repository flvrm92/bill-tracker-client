import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { IBill, IBillItem, generateDefaultBill } from 'src/app/core/models/IBill';
import { BillService } from '../../services/bill.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import { ICategory } from 'src/app/core/models/ICategory';

@Component({
  selector: 'app-create-edit',
  templateUrl: './create-edit.component.html',
  styleUrls: ['./create-edit.component.scss']
})
export class CreateEditComponent {
  bill: IBill | undefined;

  form: FormGroup<BillForm>;

  constructor(fb: FormBuilder,
    private domSanitizer: DomSanitizer,
    private billService: BillService,
    private alertService: AlertService) {
    this.form = CreateEditComponent.buildForm(fb, generateDefaultBill());
  }

  save(): void {
    console.log('save this shit', this.form);
  }

  static buildForm(fb: FormBuilder, bill: IBill): FormGroup<BillForm> {
    return fb.nonNullable.group({
      id: bill.id,
      userId: bill.userId,
      payment: bill.payment,
      total: bill.total,
      totalIncoming: bill.totalIncoming,
      billItems: fb.array<FormGroup<BillItemForm>>([]),
    });
  }
}


export interface BillResult {
  success: boolean,
  category: IBill,
  message: string,
}

export interface BillForm {
  id: FormControl<string>,
  userId: FormControl<string>,
  payment: FormControl<Date>,
  total: FormControl<number>,
  totalIncoming: FormControl<number>,
  billItems: FormArray<FormGroup<BillItemForm>>
}

export interface BillItemForm {
  billId: FormControl<string | undefined>;
  categoryId: FormControl<number>;
  category: FormControl<ICategory | undefined>;
  description: FormControl<string>;
  value: FormControl<number>;
}