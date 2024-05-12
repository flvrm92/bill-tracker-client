import { Component, DestroyRef, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { IBIllDto, IBill, IBillItem, ICategory, ISubCategory, generateDefaultBill, generateDefaultBillItem } from 'src/app/core/models';
import { AddUpdateBillItemComponent } from '../add-update-bill-item/add-update-bill-item.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { BillService } from '../../services/bill.service';
import { AlertIcon, AlertService } from 'src/app/shared/services/alert.service';

@Component({
  selector: 'app-create-edit-bill',
  templateUrl: './create-edit-bill.component.html',
  styleUrls: ['./create-edit-bill.component.scss']
})
export class CreateEditBillComponent implements OnInit {
  bill: IBill | undefined;

  form: FormGroup<BillForm>;

  billItems: IBillItem[] = [];
  isUpdate: boolean = false;

  constructor(private fb: FormBuilder,
    private dialog: MatDialog,
    private destroyRef: DestroyRef,
    private route: ActivatedRoute,
    private billService: BillService,
    private alertService: AlertService,
    private router: Router) {

    this.form = CreateEditBillComponent.buildForm(this.fb, generateDefaultBill());
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') as string;
    if (id) {
      this.isUpdate = true;
      this.billService.getById(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(bill => {
        this.form = CreateEditBillComponent.buildForm(this.fb, bill);

        const total = bill.billItems?.map(bi => bi.value).reduce((a, b) => a + b, 0);
        this.form.controls.total.setValue(total.toFixed(2));

        this.billItems = bill.billItems;

        this.calculateTotal();
      });
    }
  }

  get action(): string {
    return this.isUpdate ? 'Update' : 'Create';
  }

  save() {
    const args = this.sanitizeForm();
    const request = this.isUpdate ? this.billService.put(args) : this.billService.post(args);
    request.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(bill => {
      this.alertService.toastAlert({
        title: `Bill ${this.isUpdate ? 'updated' : 'created'}`,
        text: `Bill was ${this.isUpdate ? 'updated' : 'created'} successfully.`,
        icon: AlertIcon.Success,
      });
      this.router.navigate(['bill']);
    });
  }

  cancel() {
    if (this.form.dirty || this.form.touched) {
      this.alertService.yesOrNoAlert({
        title: 'Discard changes',
        text: 'Are you sure you want to discard the changes?',
        icon: AlertIcon.Warning,
      }).then(result => {
        if (result) this.router.navigate(['bill'])
      })
    } else {
      this.router.navigate(['bill'])
    }
  }

  addBillItem() {
    const ref = this.dialog.open<AddUpdateBillItemComponent, IBillItem, IBillItem>(AddUpdateBillItemComponent, {
      width: '50vw',
    });

    ref.afterClosed().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(result => {
      if (result) {
        this.form.controls.billItems.push(CreateEditBillComponent.buildBillItemForm(this.fb, result));
        this.billItems = [...this.billItems, result];
        this.afterFormChanges();
      }
    });
  }

  onBillItemChange(billItem: IBillItem) {
    const index = this.billItems.findIndex(bi => bi.id === billItem.id);
    this.billItems.splice(index, 1, billItem);
    this.billItems = [...this.billItems];
    this.form.controls.billItems.at(index).patchValue(billItem);
    this.afterFormChanges();
  }

  onBillItemDelete(billItem: IBillItem) {
    const index = this.billItems.findIndex(bi => bi.id === billItem.id);
    this.billItems.splice(index, 1);
    this.billItems = [...this.billItems];
    this.form.controls.billItems.removeAt(index);
    this.afterFormChanges();
  }

  static buildForm(fb: FormBuilder, bill: IBill): FormGroup<BillForm> {
    return fb.nonNullable.group({
      id: bill?.id,
      payment: bill?.paymentMonth,
      total: '0',
      totalIncoming: bill?.totalIncoming,
      billItems: fb.array<FormGroup<BillItemForm>>(
        bill?.billItems?.map(bi => CreateEditBillComponent.buildBillItemForm(fb, bi))) ?? [generateDefaultBillItem()]
    })
  }

  static buildBillItemForm(fb: FormBuilder, billItem: IBillItem): FormGroup<BillItemForm> {
    return fb.nonNullable.group({
      id: billItem.id,
      billId: billItem.billId,
      description: billItem.description,
      categoryId: billItem.categoryId,
      category: billItem.category,
      subCategoryId: billItem.subCategoryId,
      subCategory: billItem.subCategory,
      value: billItem.value,
    })
  }

  private sanitizeForm(): IBIllDto {
    const bill = this.form.value;
    return {
      id: bill.id ?? undefined,
      paymentMonth: this.justDate(bill.payment),
      totalIncoming: bill.totalIncoming ?? 0,
      billItems: bill.billItems?.map(bi => ({
        id: bi?.id ? bi.id : undefined,
        billId: bi?.billId,
        description: bi?.description,
        subCategoryId: bi?.subCategoryId,
        value: bi?.value,
      }) as IBillItem)
    } as IBIllDto;
  }

  private justDate(d: Date | undefined | string): string {
    if (!d) return new Date().toISOString().split('T')[0];
    else if (typeof d === 'string') return d;
    return d.toISOString().split('T')[0];
  }

  private calculateTotal() {
    const total = this.form.controls.billItems.value
      .map(x => x.value)
      .reduce((a, b) => (Number(a) ?? 0) + (Number(b) ?? 0), 0);

    this.form.controls.total.setValue(total?.toFixed(2) ?? '0');
  }

  private afterFormChanges(): void {
    this.calculateTotal();
    this.form.markAsDirty();
  }

}

export interface BillForm {
  id: FormControl<string | undefined>,
  payment: FormControl<Date>,
  total: FormControl<string>,
  totalIncoming: FormControl<number>,
  billItems: FormArray<FormGroup<BillItemForm>>,
}

export interface BillItemForm {
  id: FormControl<string | undefined>,
  billId: FormControl<string | undefined>,
  description: FormControl<string>,
  categoryId: FormControl<string>,
  category: FormControl<ICategory | undefined>,
  subCategoryId: FormControl<string>,
  subCategory: FormControl<ISubCategory | undefined>,
  value: FormControl<number>,
}
