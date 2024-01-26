import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { IBillItem } from 'src/app/core/models';
import { BillItemForm } from '../../pages/create-edit-bill/create-edit-bill.component';

@Component({
  selector: 'app-bill-item-list',
  templateUrl: './bill-item-list.component.html',
  styleUrls: ['./bill-item-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BillItemListComponent implements OnChanges {
  @Input() billItemsFormArray: FormArray<FormGroup<BillItemForm>> | undefined;


  displayedColumns: string[] = ['category', 'subcategory', 'value'];

  dataSource = new MatTableDataSource<IBillItem>();

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('change');
    if (changes['billItems']) {
      
    }
  }

  edit(billItem: IBillItem) {
    console.log('Edit', billItem);
  }

  delete(billItem: IBillItem) {
    console.log('Delete', billItem);
  }
}
