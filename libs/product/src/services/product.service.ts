import { Observable } from 'rxjs';
import { Product, ProductQualifier } from '../models';

export interface ProductService {
  get(qualifier: ProductQualifier): Observable<Product>;
}

export const ProductService = 'FES.ProductService';

declare global {
  interface InjectionTokensContractMap {
    [ProductService]: ProductService;
  }
}
