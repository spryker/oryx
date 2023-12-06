import { Observable } from 'rxjs';
import { ProductCategory, ProductCategoryQualifier } from '../../models';

export interface ProductCategoryService {
  /**
   * @deprecated since 1.4 use get(qualifier: ProductCategoryQualifier) instead
   */
  get(id: string): Observable<ProductCategory>;
  get(qualifier: ProductCategoryQualifier): Observable<ProductCategory>;
  getList(
    qualifier?: ProductCategoryQualifier
  ): Observable<ProductCategory[] | undefined>;

  /**
   * @deprecated since 1.4 use getList(qualifier: ProductCategoryQualifier) instead
   */
  getTree(): Observable<ProductCategory[]>;

  /**
   * @deprecated since 1.4 use getTrail(qualifier: ProductCategoryQualifier) instead
   */
  getTrail(id: string): Observable<ProductCategory[]>;
  getTrail(qualifier: ProductCategoryQualifier): Observable<ProductCategory[]>;
}

export const ProductCategoryService = 'oryx.ProductCategoryService';

declare global {
  interface InjectionTokensContractMap {
    [ProductCategoryService]: ProductCategoryService;
  }
}
