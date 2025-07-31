import { ICategory } from "./ICategory";
import { ISubCategory } from "./ISubCategory";

export interface IBill {
  id?: string;
  paymentMonth: Date;
  totalIncoming: number;
  billItems: IBillItem[];
}

export interface IBillItem {
  id?: string;
  billId?: string;
  description: string;
  categoryId: string,
  category?: ICategory;
  subCategoryId: string;
  subCategory?: ISubCategory;
  value: number | undefined;
}

export interface IBIllDto {
  id?: string;
  paymentMonth: string;
  total: number;
  totalIncoming: number;
  billItems?: IBillItemDto[];
}

export interface IBillItemDto {
  id?: string;
  billId?: string;
  description: string;
  subCategoryId: string;
  value: number;
}

export function generateDefaultBill(): IBill {
  return {
    id: '',
    paymentMonth: new Date(),
    totalIncoming: 0,
    billItems: []
  }
}

export function generateDefaultBillItem(): IBillItem {
  return {
    id: '',
    billId: '',
    description: '',
    categoryId: '',
    category: undefined,
    subCategoryId: '',
    subCategory: undefined,
    value: undefined,
  }
}