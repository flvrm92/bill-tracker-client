import { ISubCategory } from "./ISubCategory";

export interface IBillItemStatistic {
  id: string;
  subCategoryId: string;
  description: string;
  value: number;
  subCategory: ISubCategory;
}

export interface IBillItemStatisticDto {
  id: string;
  subCategoryId: string;
  description: string;
  value: number;
  subCategory: ISubCategory;
}

export interface IBillDashboard {
  id: string;
  paymentMonth: Date;
  totalIncoming: number;
  billItems: IBillItemStatistic[];
}

export interface IBillDashboardDto {
  id: string;
  paymentMonth: string;
  totalIncoming: number;
  billItems: IBillItemStatisticDto[];
}
