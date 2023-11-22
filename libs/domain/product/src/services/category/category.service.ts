import { Observable } from 'rxjs';
import { ProductCategory, ProductCategoryQualifier } from '../../models';

export interface ProductCategoryService {
  get(qualifier: ProductCategoryQualifier): Observable<ProductCategory>;
  getList(qualifier?: ProductCategoryQualifier): Observable<ProductCategory[]>;
  getTree(qualifier?: ProductCategoryQualifier): Observable<ProductCategory[]>;
  getTrail(qualifier: ProductCategoryQualifier): Observable<ProductCategory[]>;
}

export const ProductCategoryService = 'oryx.ProductCategoryService';

declare global {
  interface InjectionTokensContractMap {
    [ProductCategoryService]: ProductCategoryService;
  }
}
