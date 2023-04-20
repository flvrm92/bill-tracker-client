import { ICategory } from "./ICategory";

export interface IBill {
  id: string;
  userId: string;
  payment: Date;
  total: number;
  totalIncoming: number;
  billItems: IBillItem[];
}

export interface IBillItem {
  billId?: string;
  categoryId: number;
  category?: ICategory;
  description: string;
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
    categoryId: 0,
    description: '',
    value: 0,
  }
}