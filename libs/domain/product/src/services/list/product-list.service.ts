import { QueryState } from '@spryker-oryx/core';
import { Observable } from 'rxjs';
import { ProductList, ProductListQualifier } from '../../models';

export interface ProductListService {
  get(qualifier: ProductListQualifier): Observable<ProductList | undefined>;
  getState(
    qualifier: ProductListQualifier
  ): Observable<QueryState<ProductList | undefined>>;
}

export const ProductListService = 'oryx.ProductListService';

declare global {
  interface InjectionTokensContractMap {
    [ProductListService]: ProductListService;
  }
}
