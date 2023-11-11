import { Observable } from 'rxjs';
import { ProductCategory, ProductCategoryQualifier } from '../../../models';

export interface ProductCategoryAdapter {
  get(qualifier: ProductCategoryQualifier): Observable<ProductCategory>;
  getTree(qualifier?: ProductCategoryQualifier): Observable<ProductCategory[]>;
}

export const ProductCategoryAdapter = 'oryx.ProductCategoryAdapter';

declare global {
  interface InjectionTokensContractMap {
    [ProductCategoryAdapter]: ProductCategoryAdapter;
  }
}
