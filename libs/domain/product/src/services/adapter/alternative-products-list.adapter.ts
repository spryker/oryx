import { Observable } from 'rxjs';
import { ProductQualifier } from '../../models/product-qualifier';
import { Product } from '../../models/product.model';

export interface AlternativeProductsListAdapter {
  get(qualifier: ProductQualifier): Observable<Product[]>;
}

export const AlternativeProductsListAdapter =
  'oryx.AlternativeProductsListAdapter';

declare global {
  interface InjectionTokensContractMap {
    [AlternativeProductsListAdapter]: AlternativeProductsListAdapter;
  }
}
