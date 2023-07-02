import { formatDate } from "@angular/common";
import { Inject, Injectable } from "@angular/core";
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from "@angular/material/core";

@Injectable()
export class PickDateAdapter extends NativeDateAdapter {
  private displayFormat: string;

  constructor(@Inject('displayFormat') displayFormat: string) {
    super('en-US');
    this.displayFormat = displayFormat;
  }

  override format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      return formatDate(date, this.displayFormat ?? 'MM/yyyy', this.locale);;
    } else {
      return date.toDateString();
    }
  }
}

export const PICK_FORMATS = {
  parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' }
  }
};

export const PICK_DATE_PROVIDERS = [
  { provide: DateAdapter, useClass: PickDateAdapter },
  { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
];
