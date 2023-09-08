import { Observable } from 'rxjs';
import { ProductCategory } from '../../models';

export interface ProductCategoryService {
  add(data: ProductCategory[]): void;
  get(categoryId?: string): Observable<ProductCategory>;
  getTrail(categoryId?: string): Observable<ProductCategory[]>;
}

export const ProductCategoryService = 'oryx.ProductCategoryService';

declare global {
  interface InjectionTokensContractMap {
    [ProductCategoryService]: ProductCategoryService;
  }
}
