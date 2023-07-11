import { Observable } from 'rxjs';
import { Product, ProductQualifier } from '../../../models';

export interface ProductCategoryRelatedAdapter {
  get(qualifier: ProductQualifier): Observable<Product[]>;
}

export const ProductCategoryRelatedAdapter =
  'oryx.ProductCategoryRelatedAdapter';

declare global {
  interface InjectionTokensContractMap {
    [ProductCategoryRelatedAdapter]: ProductCategoryRelatedAdapter;
  }
}
