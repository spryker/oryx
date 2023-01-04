import { NullableGeneric } from '@spryker-oryx/utilities';
import { Observable } from 'rxjs';
import { ProductList } from '../models';

export interface ProductListPageService {
  get(): Observable<NullableGeneric<ProductList>>;
}

export const ProductListPageService = 'FES.ProductListPageService';

declare global {
  interface InjectionTokensContractMap {
    [ProductListPageService]: ProductListPageService;
  }
}
