import { Observable } from 'rxjs';
import { ProductList, ProductListQualifier } from '../../../models';

export interface ProductListAdapter {
  getKey(qualifier: ProductListQualifier): string;
  get(qualifier: ProductListQualifier): Observable<ProductList>;
}

export const ProductListAdapter = 'oryx.ProductListAdapter';

declare global {
  interface InjectionTokensContractMap {
    [ProductListAdapter]: ProductListAdapter;
  }
}
