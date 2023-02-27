import { QueryState } from '@spryker-oryx/core';
import { Observable } from 'rxjs';
import { Product, ProductQualifier } from '../models';

export interface ProductService {
  get(qualifier: ProductQualifier): Observable<Product | undefined>;
  getState(qualifier: ProductQualifier): Observable<QueryState<Product>>;
}

export const ProductService = 'oryx.ProductService';

declare global {
  interface InjectionTokensContractMap {
    [ProductService]: ProductService;
  }
}
