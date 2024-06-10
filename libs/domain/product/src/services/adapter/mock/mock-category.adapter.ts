import {
  ProductCategory,
  ProductCategoryAdapter,
  ProductCategoryQualifier,
} from '@spryker-oryx/product';
import { Observable, of } from 'rxjs';
import { mockProductsCategories } from './mock-category';

export class MockProductCategoryAdapter implements ProductCategoryAdapter {
  get(
    qualifier: string | ProductCategoryQualifier
  ): Observable<ProductCategory> {
    if (typeof qualifier === 'string') return this.get({ id: qualifier });
    const category = mockProductsCategories.find(
      (p) => p.id === qualifier.id
    ) as ProductCategory;
    return of(category);
  }

  getTree(qualifier?: ProductCategoryQualifier): Observable<ProductCategory[]> {
    return of(
      mockProductsCategories.filter((category) => {
        return !qualifier?.parent
          ? !category.parent
          : category.parent === qualifier?.parent;
      })
    );
  }
}
