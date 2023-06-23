import { Observable } from 'rxjs';
import { ProductQualifier } from '../models/product-qualifier';
import { Product } from '../models/product.model';

export interface ProductRelationsListService {
  get(qualifier: ProductQualifier): Observable<Product[] | undefined>;
}

export const ProductRelationsListService = 'oryx.ProductRelationsListService';

declare global {
  interface InjectionTokensContractMap {
    [ProductRelationsListService]: ProductRelationsListService;
  }
}
