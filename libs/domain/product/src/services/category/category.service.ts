import { Observable } from 'rxjs';
import { ProductCategory, ProductCategoryNode } from '../../models';

export interface CategoryData {
  tree: ProductCategoryNode[];
  trails: string[][];
}

export interface ProductCategoryService {
  get(): Observable<CategoryData>;
  getTrail(categoryId?: string): Observable<ProductCategory[]>;
}

export const ProductCategoryService = 'oryx.ProductCategoryService';

declare global {
  interface InjectionTokensContractMap {
    [ProductCategoryService]: ProductCategoryService;
  }
}
