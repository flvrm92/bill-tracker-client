import { ICategory } from "./ICategory";

export interface ISubCategory {
  id: string;
  name: string;
  categoryId: string;
  category?: ICategory;
  recurring: boolean;
}

export interface ISubCategoryDto {
  id: string;
  name: string;
  category: ICategory;
  categoryId: string;
  recurring: boolean;
}

export function generateDefaultSubCategory(): ISubCategory {
  return {
    id: '',
    name: '',
    categoryId: '',
    recurring: false,
  }
}