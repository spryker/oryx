import { Observable } from 'rxjs';
import { ProductCategoryNode } from '../../../models';

export interface ProductCategoryAdapter {
  getTree(): Observable<ProductCategoryNode[]>;
}

export const ProductCategoryAdapter = 'oryx.ProductCategoryAdapter';

declare global {
  interface InjectionTokensContractMap {
    [ProductCategoryAdapter]: ProductCategoryAdapter;
  }
}
