import { createQuery, injectQuery } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { LocaleChanged } from '@spryker-oryx/i18n';
import { BehaviorSubject, Observable, map, of, switchMap } from 'rxjs';
import { CategoryQualifier, ProductCategory } from '../../models';
import { ProductCategoryAdapter } from './adapter/product-category.adapter';
import { ProductCategoryService } from './category.service';
import { CategoryQuery } from './state';

export class DefaultProductCategoryService implements ProductCategoryService {
  constructor(
    protected categoryQuery$ = injectQuery<ProductCategory, CategoryQualifier>(
      CategoryQuery
    ),
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

  get(id: string): Observable<ProductCategory> {
    return this.categoryQuery$.get({ id }) as Observable<ProductCategory>;
  }

  getTree(): Observable<ProductCategory[]> {
    return this.treeQuery$.get() as Observable<ProductCategory[]>;
  }

  getTrail(categoryId: string): Observable<ProductCategory[]> {
    return this.get(categoryId).pipe(
      switchMap((category) =>
        category.parent
          ? this.getTrail(category.parent).pipe(
              map((trail) => [...trail, category])
            )
          : of([category])
      ),
      map((trail) => trail.sort((a, b) => (a.id === b.parent ? -1 : 1)))
    );
  }
}
