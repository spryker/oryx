import { QueryState } from '@spryker-oryx/core';
import { Observable } from 'rxjs';
import { ProductList, ProductListQualifier } from '../models';

export interface ProductListService {
  get(qualifier: ProductListQualifier): Observable<ProductList | undefined>;
  getState(
    qualifier: ProductListQualifier
  ): Observable<QueryState<ProductList | undefined>>;

  /** @deprecated Use getState instead */
  getError(qualifier: ProductListQualifier): Observable<false | Error>;

  getSearchParams(qualifier: ProductListQualifier): Record<string, string>;
}

export const ProductListService = 'oryx.ProductListService';

declare global {
  interface InjectionTokensContractMap {
    [ProductListService]: ProductListService;
  }
}
