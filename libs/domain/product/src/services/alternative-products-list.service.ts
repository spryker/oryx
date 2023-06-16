import { Observable } from 'rxjs';
import { ProductQualifier } from '../models/product-qualifier';
import { Product } from '../models/product.model';

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
