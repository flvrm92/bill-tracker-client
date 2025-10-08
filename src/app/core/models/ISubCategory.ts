import { ICategory } from "./ICategory";

export interface ISubCategory {
  id: string;
  name: string;
  categoryId: string;
  category?: ICategory;
  active: boolean;
}

export interface ISubCategoryDto {
  id: string;
  name: string;
  category: ICategory;
  categoryId: string;
  active: boolean;
}

export function generateDefaultSubCategory(): ISubCategory {
  return {
    id: '',
    name: '',
    categoryId: '',
    active: false,
  }
}