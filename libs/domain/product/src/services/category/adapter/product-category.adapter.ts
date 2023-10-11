import { Observable } from 'rxjs';
import { ProductCategory } from '../../../models';

export interface ProductCategoryAdapter {
  get(categoryId: string): Observable<ProductCategory>;
  getTree(): Observable<ProductCategory[]>;
}

export const ProductCategoryAdapter = 'oryx.ProductCategoryAdapter';

declare global {
  interface InjectionTokensContractMap {
    [ProductCategoryAdapter]: ProductCategoryAdapter;
  }
}
