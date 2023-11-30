import { injectQuery } from '@spryker-oryx/core';
import { Observable, map, of, switchMap } from 'rxjs';
import { ProductCategory, ProductCategoryQualifier } from '../../models';
import { ProductCategoryService } from './category.service';
import { CategoryListQuery, CategoryQuery } from './state';

export class DefaultProductCategoryService implements ProductCategoryService {
  protected categoryQuery = injectQuery<
    ProductCategory,
    ProductCategoryQualifier
  >(CategoryQuery);

  protected listQuery$ = injectQuery<
    ProductCategory[],
    ProductCategoryQualifier
  >(CategoryListQuery);
  protected treeQuery$ = this.listQuery$;

  get(
    qualifier: ProductCategoryQualifier | string
  ): Observable<ProductCategory> {
    if (typeof qualifier === 'string') return this.get({ id: qualifier });
    return this.categoryQuery.get(qualifier) as Observable<ProductCategory>;
  }

  getList(
    qualifier?: ProductCategoryQualifier
  ): Observable<ProductCategory[] | undefined> {
    return this.listQuery$.get(qualifier);
  }

  getTrail(
    qualifier: ProductCategoryQualifier | string
  ): Observable<ProductCategory[]> {
    if (typeof qualifier === 'string') return this.getTrail({ id: qualifier });

    return this.get(qualifier).pipe(
      switchMap((category) =>
        category.parent
          ? this.getTrail({ ...qualifier, id: category.parent }).pipe(
              map((trail) => [...trail, category])
            )
          : of([category])
      ),
      map((trail) => trail.sort((a, b) => (a.id === b.parent ? -1 : 1)))
    );
  }

  getTree(): Observable<ProductCategory[]> {
    return this.treeQuery$.get() as Observable<ProductCategory[]>;
  }
}
