import { Provider, inject } from '@spryker-oryx/di';
import { Facet, FacetValue } from '@spryker-oryx/product';
import { RouteType } from '@spryker-oryx/router';
import {
  Breadcrumb,
  BreadcrumbsResolver,
  BreadcrumbsResolvers,
  LinkService,
} from '@spryker-oryx/site';
import { Observable, combineLatest, map, switchMap, throwError } from 'rxjs';
import { FacetListService } from '../facet-list.service';

interface FlatFacet {
  name: string;
  value: string;
}

export class CategoryBreadcrumbsResolver implements BreadcrumbsResolver {
  constructor(
    protected facetListService = inject(FacetListService),
    protected linkService = inject(LinkService)
  ) {}

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
          flatten.map(({ name, value }) =>
            this.linkService
              .get({ id: value, type: RouteType.Category })
              .pipe(map((url) => ({ text: name, url })))
          )
        )
      : throwError(() => new Error('Categories breadcrumbs list is empty!'));
  }

  resolve(): Observable<Breadcrumb[]> {
    return this.facetListService
      .getFacet({ parameter: 'category' })
      .pipe(switchMap((facet) => this.getFlattenCategoriesBreadcrumbs(facet)));
  }
}

export const CategoryBreadcrumbs: Provider = {
  provide: `${BreadcrumbsResolvers}${String(RouteType.Category).toUpperCase()}`,
  useClass: CategoryBreadcrumbsResolver,
};
