import { Observable } from 'rxjs';
import { ProductQualifier } from '../../models/product-qualifier';
import { Product } from '../../models/product.model';

export interface ProductRelationsListAdapter {
  get(qualifier: ProductQualifier): Observable<Product[]>;
}

export const ProductRelationsListAdapter = 'oryx.ProductRelationsListAdapter';

declare global {
  interface InjectionTokensContractMap {
    [ProductRelationsListAdapter]: ProductRelationsListAdapter;
  }
}
