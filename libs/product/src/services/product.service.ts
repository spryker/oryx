import { Observable } from 'rxjs';
import { Product, ProductDomain, ProductQualifier } from '../models';

export interface ProductService {
  get(qualifier: ProductQualifier): Observable<Product>;
}

declare global {
  interface InjectionTokensContractMap {
    [ProductDomain.ProductService]: ProductService;
  }
}

export const ProductService = ProductDomain.ProductService;
