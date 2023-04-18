import {
  ElementResolver,
  PageMetaResolver,
  ResolverScore,
} from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { FacetListService } from '@spryker-oryx/search';
import { map, Observable, switchMap } from 'rxjs';
import { FacetValue } from '../../models';

export class CategoryPageTitleMetaResolver implements PageMetaResolver {
  constructor(
    protected router = inject(RouterService),
    protected facets = inject(FacetListService)
  ) {}

  getScore(): Observable<number> {
    return this.router
      .currentQuery()
      .pipe(map((query) => (query?.category ? 2 : ResolverScore.Fallback)));
  }

  resolve(): Observable<ElementResolver> {
    return this.router.currentQuery().pipe(
      switchMap((query) => {
        return this.facets.get().pipe(
          map((facets) => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const selectedId = Number(query!.category!);
            const list = facets?.find((facet) => facet.parameter === 'category')
              ?.values as FacetValue[];

            for (const item of list) {
              if (Number(item.value) === selectedId) {
                return {
                  title: item.name,
                };
              }

              if (item.children) {
                list.push(...item.children);
              }
            }

            return {
              title: 'Category page',
            };
          })
        );
      })
    );
  }
}
