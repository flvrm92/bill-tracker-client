import { ICategory } from "./ICategory";
import { ISubCategory } from "./ISubCategory";

export interface IBill {
  id: string;
  userId: string;
  payment: Date;
  total: number;
  totalIncoming: number;
  billItems: IBillItem[];
}

export interface IBillItem {
  id?: string;
  billId?: string;
  categoryId: string;
  category?: ICategory;
  subCategoryId: string;
  subCategory?: ISubCategory;
  value: number;
}

export function generateDefaultBill(): IBill {
  return {
    id: '',
    userId: '',
    payment: new Date(),
    total: 0,
    totalIncoming: 0,
    billItems: []
  }
}

export function generateDefaultBillItem(): IBillItem {
  return {
    categoryId: '',
    category: undefined,
    subCategoryId: '',
    subCategory: undefined,
    value: 0,
  }
}