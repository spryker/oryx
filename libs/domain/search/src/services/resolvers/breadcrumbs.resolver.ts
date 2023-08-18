import { INJECTOR, Provider, inject } from '@spryker-oryx/di';
import { Facet, FacetValue } from '@spryker-oryx/product';
import { RouteType } from '@spryker-oryx/router';
import {
  Breadcrumb,
  BreadcrumbsResolver,
  BreadcrumbsResolvers,
  LinkService,
} from '@spryker-oryx/site';
import {
  Observable,
  combineLatest,
  map,
  of,
  switchMap,
  throwError,
} from 'rxjs';
import { FacetListService } from '../facet-list.service';

export type FlatFacet = { name: string; value: string };

export class CategoryBreadcrumbsResolver implements BreadcrumbsResolver {
  constructor(protected injector = inject(INJECTOR)) {}

  protected getFlattenCategoriesBreadcrumbs(
    categories: Facet
  ): Observable<Breadcrumb[]> {
    const getSelected = (facets?: FacetValue[]): FacetValue | undefined => {
      return facets?.find(
        ({ selected, children }) => selected || getSelected(children)
      );
    };

    const flattenSelected = (facet?: FacetValue): FlatFacet[] => {
      if (!facet) {
        return [];
      }
      const { selected, name, value, children } = facet;
      return [
        { name: name ?? '', value: String(value) },
        ...(!selected ? flattenSelected(children?.[0]) : []),
      ];
    };

    const selected = getSelected(categories.values as FacetValue[]);
    const flatten = flattenSelected(selected);
    return flatten.length
      ? combineLatest(
          flattenSelected(selected).map(({ name, value }) =>
            this.injector
              .inject(LinkService)
              .get({ id: value, type: RouteType.Category })
              .pipe(map((url) => ({ text: name, url })))
          )
        )
      : of([]);
  }

  resolve(): Observable<Breadcrumb[]> {
    return this.injector
      .inject(FacetListService)
      .getFacet({ parameter: 'category' })
      .pipe(
        switchMap((facet) => this.getFlattenCategoriesBreadcrumbs(facet)),
        switchMap((breadcrumbs) =>
          breadcrumbs.length
            ? of(breadcrumbs)
            : throwError(
                () => new Error('Categories breadcrumbs list is empty!')
              )
        )
      );
  }
}

export const CategoryBreadcrumbs: Provider = {
  provide: `${BreadcrumbsResolvers}${String(RouteType.Category).toUpperCase()}`,
  useClass: CategoryBreadcrumbsResolver,
};
