import { Observable } from 'rxjs';
import { Pagination, ProductList } from '../../models';

export interface ProductListPageService {
  get(): Observable<ProductList | undefined>;
  getPagination(): Observable<Pagination | undefined>;
}

export const ProductListPageService = 'oryx.ProductListPageService';

declare global {
  interface InjectionTokensContractMap {
    [ProductListPageService]: ProductListPageService;
  }
}
