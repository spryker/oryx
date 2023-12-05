import { Observable } from 'rxjs';
import { Product, ProductQualifier } from '../../models';

export interface ProductAdapter {
  getKey(qualifier: ProductQualifier): string;
  get(qualifier: ProductQualifier): Observable<Product>;
}

export const ProductAdapter = 'oryx.ProductAdapter';

export const ProductIncludes = 'product';

declare global {
  interface InjectionTokensContractMap {
    [ProductAdapter]: ProductAdapter;
  }
}
