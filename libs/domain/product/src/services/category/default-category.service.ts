import { createQuery, injectQuery } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { LocaleChanged } from '@spryker-oryx/i18n';
import { BehaviorSubject, Observable, map, of, switchMap } from 'rxjs';
import { ProductCategory, ProductCategoryQualifier } from '../../models';
import { ProductCategoryAdapter } from './adapter/product-category.adapter';
import { ProductCategoryService } from './category.service';
import {CategoryListQuery, CategoryQuery} from './state';

export class DefaultProductCategoryService implements ProductCategoryService {
  protected categoryQuery = injectQuery<
    ProductCategory,
    ProductCategoryQualifier
  >(CategoryQuery);

  protected listQuery$ = injectQuery<ProductCategory[], ProductCategoryQualifier>(CategoryListQuery);

  get(
    qualifier: ProductCategoryQualifier | string
  ): Observable<ProductCategory> {
    if (typeof qualifier === 'string') return this.get({ id: qualifier });
    return this.categoryQuery.get(qualifier) as Observable<ProductCategory>;
  }

  getList(qualifier?: ProductCategoryQualifier): Observable<ProductCategory[]> {
    const list = this.listQuery$.get() as Observable<ProductCategory[]>;
    return list.pipe(
      map((items: ProductCategory[]) => {
        const excludes = this.getExcludes(
          items.map((c) => c.id),
          qualifier?.exclude
        );
        return items
          .filter((category) => {
            return !qualifier?.parent
              ? !category.parent
              : category.parent === qualifier?.parent;
          })
          .filter((category) => !excludes.includes(category.id));
      })
    );
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
    return this.listQuery$.get() as Observable<ProductCategory[]>;
  }

  protected getExcludes(
    categories: string[],
    exclude?: string | string[]
  ): string[] {
    if (!exclude) return [];
    let excludedIds: string[] = [];

    // Convert both string and array notations to array of strings
    const excludeIds = Array.isArray(exclude)
      ? exclude.map(String)
      : exclude.split(',').map((id) => id.trim());

    // Handle range notations like >5, <4, 4..11
    excludedIds = categories.filter((categoryId) => {
      return excludeIds.some((excludedId) => {
        if (excludedId.includes('..')) {
          const [start, end] = excludedId
            .split('..')
            .map((num) => parseInt(num, 10));
          const num = parseInt(categoryId, 10);
          return num >= start && num <= end;
        } else if (excludedId.startsWith('>')) {
          const threshold = parseInt(excludedId.slice(1), 10);
          return parseInt(categoryId, 10) > threshold;
        } else if (excludedId.startsWith('<')) {
          const threshold = parseInt(excludedId.slice(1), 10);
          return parseInt(categoryId, 10) < threshold;
        } else {
          // Regular ID match
          return categoryId === excludedId;
        }
      });
    });

    return excludedIds;
  }
}
