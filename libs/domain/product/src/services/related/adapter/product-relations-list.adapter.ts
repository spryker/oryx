import { Observable } from 'rxjs';
import { Product, ProductQualifier } from '../../../models';

export interface ProductRelationsListAdapter {
  get(qualifier: ProductQualifier): Observable<Product[]>;
}

export const ProductRelationsListAdapter = 'oryx.ProductRelationsListAdapter';

declare global {
  interface InjectionTokensContractMap {
    [ProductRelationsListAdapter]: ProductRelationsListAdapter;
  }
}
