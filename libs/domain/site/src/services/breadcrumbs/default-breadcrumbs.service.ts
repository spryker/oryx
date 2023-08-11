import { Observable, map, of, switchMap, tap } from 'rxjs';
import { Breadcrumb } from '../../models';
import { BreadcrumbsService } from './breadcrumbs.service';
import { resolve } from '@spryker-oryx/di';
import { RouteType, RouterService } from '@spryker-oryx/router';
import { PageMetaResolverService } from '@spryker-oryx/core';

export class DefaultBreadcrumbsService implements BreadcrumbsService {
  protected routerService = resolve(RouterService);
  protected pageMetaResolver = resolve(PageMetaResolverService);

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

  get(): Observable<Breadcrumb[]> {
    return this.routerService.currentRouteWithParams().pipe(switchMap(route => {
      switch(route.type){
        case RouteType.ProductList:
          return this.searchBreadcrumbs();
        default:
          return this.defaultBreadcrumbs();
      }
    }))
  }
}
