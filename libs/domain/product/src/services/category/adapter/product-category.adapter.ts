import { Transformer } from '@spryker-oryx/core';
import { Observable } from 'rxjs';
import { ProductCategory, ProductCategoryQualifier } from '../../../models';

export interface ProductCategoryAdapter {
  /**
   * @deprecated since 1.4 use get(qualifier: ProductCategoryQualifier) instead
   */
  get(qualifier: string): Observable<ProductCategory>;
  get(qualifier: ProductCategoryQualifier): Observable<ProductCategory>;
  getTree(qualifier?: ProductCategoryQualifier): Observable<ProductCategory[]>;
}

export const ProductCategoryAdapter = 'oryx.ProductCategoryAdapter';

export const CategoryNormalizer = 'oryx.CategoryNormalizer';
export const CategoryListNormalizer = 'oryx.CategoryListNormalizer';
export const CategoryNodeNormalizer = 'oryx.CategoryNodeNormalizer';
export const CategoryTreeNormalizer = 'oryx.CategoryTreeNormalizer';

declare global {
  interface InjectionTokensContractMap {
    [ProductCategoryAdapter]: ProductCategoryAdapter;
    [CategoryNormalizer]: Transformer<object>[];
    [CategoryListNormalizer]: Transformer<object>[];
    [CategoryNodeNormalizer]: Transformer<ProductCategory>[];
    [CategoryTreeNormalizer]: Transformer<ProductCategory[]>[];
  }
}
