import { ElementResolver, PageMetaResolver } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { FacetValue } from '@spryker-oryx/product';
import { RouterService } from '@spryker-oryx/router';
import { Observable, combineLatest, map, of, switchMap } from 'rxjs';
import { FacetListService } from '../facet-list.service';

export class CategoryPageTitleMetaResolver implements PageMetaResolver {
  constructor(
    protected router = inject(RouterService),
    protected facets = inject(FacetListService)
  ) {}

  getScore(): Observable<unknown[]> {
    return combineLatest([
      this.router
        .currentRoute()
        .pipe(map((route) => route.includes('category'))),
      this.router
        .currentQuery()
        .pipe(map(() => this.router.getPathId('category'))),
    ]);
  }

  resolve(): Observable<ElementResolver> {
    return this.router.currentQuery().pipe(
      switchMap(() => {
        const categoryId = this.router.getPathId('category');

        if (!categoryId) {
          return of({});
        }

        return this.facets.get().pipe(
          map((facets) => {
            const selectedId = String(categoryId);
            const list = [
              ...((facets?.find((facet) => facet.parameter === 'category')
                ?.values as FacetValue[]) ?? []),
            ];

            for (const item of list) {
              if (String(item.value) === selectedId) {
                return {
                  title: item.name,
                };
              }

              if (item.children) {
                list.push(...item.children);
              }
            }

            return {};
          })
        );
      })
    );
  }
}
