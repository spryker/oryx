import { Observable } from 'rxjs';
import { ProductCategory, ProductCategoryQualifier } from '../../../models';

export interface ProductCategoryAdapter {
  /**
   * @deprecated since 1.4 use get(qualifier: ProductCategoryQualifier) instead
   */
  get(qualifier: string): Observable<ProductCategory>;
  get(qualifier: ProductCategoryQualifier): Observable<ProductCategory>;
  getTree(qualifier?: ProductCategoryQualifier): Observable<ProductCategory[]>;
}

export const ProductCategoryAdapter = 'oryx.ProductCategoryAdapter';

declare global {
  interface InjectionTokensContractMap {
    [ProductCategoryAdapter]: ProductCategoryAdapter;
  }
}
