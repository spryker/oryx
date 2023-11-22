import { createQuery, injectQuery } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { LocaleChanged } from '@spryker-oryx/i18n';
import { BehaviorSubject, Observable, map, of, switchMap, tap } from 'rxjs';
import { ProductCategory, ProductCategoryQualifier } from '../../models';
import { ProductCategoryAdapter } from './adapter/product-category.adapter';
import { ProductCategoryService } from './category.service';
import { CategoryQuery } from './state';

export class DefaultProductCategoryService implements ProductCategoryService {
  constructor(
    protected categoryQuery$ = injectQuery<
      ProductCategory,
      ProductCategoryQualifier
    >(CategoryQuery),
    protected adapter = inject(ProductCategoryAdapter)
  ) {}

  protected categories = new Map<string, BehaviorSubject<ProductCategory>>();

  protected treeQuery$ = createQuery({
    loader: () => this.adapter.getTree(),
    onLoad: [
      ({ data: categories }) => {
        categories?.forEach((category) => {
          this.categoryQuery$.set({
            data: category,
            qualifier: { id: category.id },
          });
        });
      },
    ],
    refreshOn: [LocaleChanged],
  });

  get(qualifier: ProductCategoryQualifier): Observable<ProductCategory> {
    return this.categoryQuery$.get(qualifier) as Observable<ProductCategory>;
  }

  getList(qualifier?: ProductCategoryQualifier): Observable<ProductCategory[]> {
    const list = this.treeQuery$.get() as Observable<ProductCategory[]>;
    return list.pipe(
      map((items) =>
        items.filter((category) => {
          return !qualifier?.parent
            ? !category.parent
            : category.parent === qualifier?.parent;
        })
      )
    );
  }

  getTree(qualifier?: ProductCategoryQualifier): Observable<ProductCategory[]> {
    return this.treeQuery$.get() as Observable<ProductCategory[]>;
  }

  getTrail(qualifier: ProductCategoryQualifier): Observable<ProductCategory[]> {
    return this.get(qualifier).pipe(
      switchMap((category) =>
        category.parent
          ? this.getTrail({ ...qualifier, id: category.parent }).pipe(
              map((trail) => [...trail, category])
            )
          : of([category])
      ),
      map((trail) => trail.sort((a, b) => (a.id === b.parent ? -1 : 1))),
      tap(console.log)
    );
  }
}
