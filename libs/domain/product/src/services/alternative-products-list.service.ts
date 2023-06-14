import { Product } from '@spryker-oryx/product';
import { Observable } from 'rxjs';

export interface AlternativeProductsListService {
  get(sku: string): Observable<Product[] | undefined>;
}

export const AlternativeProductsListService =
  'oryx.AlternativeProductsListService';

declare global {
  interface InjectionTokensContractMap {
    [AlternativeProductsListService]: AlternativeProductsListService;
  }
}
