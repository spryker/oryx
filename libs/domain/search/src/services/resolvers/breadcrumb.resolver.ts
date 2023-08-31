import { Provider, inject } from '@spryker-oryx/di';
import { Facet, FacetValue } from '@spryker-oryx/product';
import { RouteType } from '@spryker-oryx/router';
import {
  BreadcrumbItem,
  BreadcrumbResolver,
  BreadcrumbResolvers,
  LinkService,
} from '@spryker-oryx/site';
import { Observable, combineLatest, map, switchMap, throwError } from 'rxjs';
import { FacetListService } from '../facet-list.service';

interface FlatFacet {
  name: string;
  value: string;
}

export class CategoryBreadcrumbResolver implements BreadcrumbResolver {
  constructor(
    protected facetListService = inject(FacetListService),
    protected linkService = inject(LinkService)
  ) {}

  protected getFlattenCategoriesBreadcrumb(
    categories: Facet
  ): Observable<BreadcrumbItem[]> {
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
              .pipe(map((url) => ({ text: { raw: name }, url })))
          )
        )
      : throwError(() => new Error('Categories breadcrumb list is empty!'));
  }

  resolve(): Observable<BreadcrumbItem[]> {
    return this.facetListService
      .getFacet({ parameter: 'category' })
      .pipe(switchMap((facet) => this.getFlattenCategoriesBreadcrumb(facet)));
  }
}

export const CategoryBreadcrumb: Provider = {
  provide: `${BreadcrumbResolvers}${RouteType.Category}`,
  useClass: CategoryBreadcrumbResolver,
};
