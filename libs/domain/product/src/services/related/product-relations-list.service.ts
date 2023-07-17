import { Observable } from 'rxjs';
import { Product, ProductQualifier } from '../../models';

export interface ProductRelationsListService {
  get(qualifier: ProductQualifier): Observable<Product[] | undefined>;
}

export const ProductRelationsListService = 'oryx.ProductRelationsListService';

declare global {
  interface InjectionTokensContractMap {
    [ProductRelationsListService]: ProductRelationsListService;
  }
}
