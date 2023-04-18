export interface ICategory {
  id: string;
  name: string;
}

export function generateDefaultCategory(): ICategory {
  return {
    id: '',
    name: ''
  }
}