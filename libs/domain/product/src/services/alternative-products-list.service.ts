import { Product, ProductQualifier } from '@spryker-oryx/product';
import { Observable } from 'rxjs';

export interface AlternativeProductsListService {
  get(qualifier: ProductQualifier): Observable<Product[] | undefined>;
}

export const AlternativeProductsListService =
  'oryx.AlternativeProductsListService';

declare global {
  interface InjectionTokensContractMap {
    [AlternativeProductsListService]: AlternativeProductsListService;
  }
}
