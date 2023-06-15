import { Product } from '../models/product.model';
import { ProductQualifier } from '../models/product-qualifier';
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
