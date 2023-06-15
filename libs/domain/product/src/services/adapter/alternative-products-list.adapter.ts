import { Observable } from 'rxjs';
import { Product } from '../../models/product.model';
import { ProductQualifier } from '../../models/product-qualifier';

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
