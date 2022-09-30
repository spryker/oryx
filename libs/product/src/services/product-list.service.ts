import { HttpErrorResponse } from '@spryker-oryx/core';
import { NullableGeneric } from '@spryker-oryx/typescript-utils';
import { Observable } from 'rxjs';
import { ProductList } from '../models';
import { ProductListQualifier } from '../models/product-list-qualifier';

export interface ProductListService {
  get(
    qualifier: ProductListQualifier
  ): Observable<NullableGeneric<ProductList>>;
  getError(
    qualifier: ProductListQualifier
  ): Observable<NullableGeneric<HttpErrorResponse>>;

  getSearchParams(qualifier: ProductListQualifier): Record<string, string>;
}

export const ProductListService = 'FES.ProductListService';

declare global {
  interface InjectionTokensContractMap {
    [ProductListService]: ProductListService;
  }
}
