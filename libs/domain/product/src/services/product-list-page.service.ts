import { NullableGeneric } from '@spryker-oryx/utilities';
import { Observable } from 'rxjs';
import { Pagination, ProductList } from '../models';

export interface ProductListPageService {
  get(): Observable<NullableGeneric<ProductList>>;
  getPagination(): Observable<Pagination | undefined>;
}

export const ProductListPageService = 'oryx.ProductListPageService';

declare global {
  interface InjectionTokensContractMap {
    [ProductListPageService]: ProductListPageService;
  }
}
