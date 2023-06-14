import { Product, ProductQualifier } from '@spryker-oryx/product';
import { Observable } from 'rxjs';

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
