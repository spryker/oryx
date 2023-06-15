import { Observable } from 'rxjs';
import { Product } from '../../models/product.model';

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
