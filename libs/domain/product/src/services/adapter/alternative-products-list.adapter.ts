import { Product } from '@spryker-oryx/product';
import { Observable } from 'rxjs';

export interface AlternativeProductsListAdapter {
  get(sku: string): Observable<Product[]>;
}

export const AlternativeProductsListAdapter =
  'oryx.AlternativeProductsListAdapter';

declare global {
  interface InjectionTokensContractMap {
    [AlternativeProductsListAdapter]: AlternativeProductsListAdapter;
  }
}
