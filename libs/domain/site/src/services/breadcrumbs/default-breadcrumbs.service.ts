import { Observable, combineLatest, map, of, switchMap } from 'rxjs';
import { Breadcrumb } from '../../models';
import { BreadcrumbsService } from './breadcrumbs.service';
import { resolve } from '@spryker-oryx/di';
import { RouteType, RouterService } from '@spryker-oryx/router';
import { PageMetaResolverService } from '@spryker-oryx/core';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { FacetListService } from '@spryker-oryx/search';
import { Facet, FacetValue } from '@spryker-oryx/product';
import { LinkService } from '../link';

export type FlatFacet = {name: string, value: string};

export class DefaultBreadcrumbsService implements BreadcrumbsService {
  protected routerService = resolve(RouterService);
  protected pageMetaResolver = resolve(PageMetaResolverService);
  protected facetsListService = resolve(FacetListService);
  protected linkService = resolve(LinkService);

  protected homeBreadcrumb = {
    i18n: { token: 'breadcrumbs.home'},
    url: '/'
  }

  protected defaultBreadcrumbs(): Observable<Breadcrumb[]> {
    return this.pageMetaResolver.getTitle().pipe(map(
      text => ([
        this.homeBreadcrumb,
        { text }
      ])
    ));
  }

  protected searchBreadcrumbs(): Observable<Breadcrumb[]> {
    return this.routerService.currentRouteWithParams().pipe(map(
      ({query}) => ([
        this.homeBreadcrumb,
        { i18n: query.q ? { token: 'breadcrumbs.search-for-"<q>"', values: query as Record<string, string>} : { token: 'breadcrumbs.search'} }
      ])
    ));
  }

  protected getFlattenCategoriesBreadcrumbs(categories: Facet): Observable<Breadcrumb[]> {
    const getSelected = (facets?: FacetValue[]): FacetValue | undefined => {
      return facets?.find(({selected, children}) => selected || getSelected(children))
    }

    const flattenSelected = (facet?: FacetValue): FlatFacet[] => {
      if (!facet) {
        return []
      }
      const { selected, name, value, children } = facet;
      return [
        { name: name ?? '', value: String(value) },
        ...(!selected ? flattenSelected(children?.[0]) : [])
      ]
    }

    const selected = getSelected(categories.values as FacetValue[]);
    return combineLatest(
      flattenSelected(selected).map(({name, value}) => this.linkService.get({id: value, type: RouteType.Category}).pipe(map(
        url => ({ text: name, url })
      )))
    );
  }

  protected categoryBreadcrumbs(): Observable<Breadcrumb[]> {
    return this.facetsListService.getFacet({parameter: 'category'}).pipe(
      switchMap((facet) => this.getFlattenCategoriesBreadcrumbs(facet)),
      switchMap(breadcrumbs => breadcrumbs?.length ? of([
        this.homeBreadcrumb,
        ...breadcrumbs
      ]) : this.defaultBreadcrumbs())
    );
  }

  get(): Observable<Breadcrumb[]> {
    return this.routerService.currentRouteWithParams().pipe(switchMap(route => {
      switch(route.type){
        case RouteType.Category:
          return this.categoryBreadcrumbs();
        case RouteType.ProductList:
          return this.searchBreadcrumbs();
        default:
          return this.defaultBreadcrumbs();
      }
    }))
  }
}
