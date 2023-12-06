import { Observable } from 'rxjs';
import { Product, ProductQualifier } from '../../models';

export interface ProductAdapter {
  getKey(qualifier: ProductQualifier): string;
  get(qualifier: ProductQualifier): Observable<Product>;
}

export const ProductAdapter = 'oryx.ProductAdapter';
export const ProductResource = 'oryx.ProductResource';

declare global {
  interface InjectionTokensContractMap {
    [ProductAdapter]: ProductAdapter;
  }
}
