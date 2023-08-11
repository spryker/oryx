import { PageMetaResolverService } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import { RouteType, RouterService } from '@spryker-oryx/router';
import { Observable, map, of, switchMap } from 'rxjs';
import { Breadcrumb } from '../../models';
import {
  BreadcrumbsQualifier,
  BreadcrumbsResolver,
  BreadcrumbsResolvers,
  BreadcrumbsService,
} from './breadcrumbs.service';

export class DefaultBreadcrumbsService implements BreadcrumbsService {
  protected routerService = resolve(RouterService);
  protected pageMetaResolver = resolve(PageMetaResolverService);

  protected homeBreadcrumb = {
    i18n: { token: 'breadcrumbs.home' },
    url: '/',
  };

  protected defaultBreadcrumbs(): Observable<Breadcrumb[]> {
    return this.pageMetaResolver
      .getTitle()
      .pipe(map((text) => [this.homeBreadcrumb, { text }]));
  }

  protected getResolverKey(type: string): string {
    return `${BreadcrumbsResolvers}${type}`;
  }

  protected resolveType(
    qualifier?: BreadcrumbsQualifier
  ): Observable<RouteType | undefined> {
    return qualifier?.type
      ? of(qualifier.type)
      : this.routerService
          .currentRouteWithParams()
          .pipe(map((route) => route.type as RouteType | undefined));
  }

  get(qualifier?: BreadcrumbsQualifier): Observable<Breadcrumb[]> {
    return this.resolveType(qualifier).pipe(
      switchMap((type) => {
        try {
          if (!type) throw 'Incorrect route type!';
          const key = this.getResolverKey(String(type).toUpperCase());
          return resolve<BreadcrumbsResolver>(key)
            .resolve()
            .pipe(map((breadcrumbs) => [this.homeBreadcrumb, ...breadcrumbs]));
        } catch {
          return this.defaultBreadcrumbs();
        }
      })
    );
  }
}
