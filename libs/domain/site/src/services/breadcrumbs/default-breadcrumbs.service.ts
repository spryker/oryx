import { INJECTOR, inject, resolve } from '@spryker-oryx/di';
import { RouteType, RouterService } from '@spryker-oryx/router';
import { Observable, catchError, map, of, switchMap } from 'rxjs';
import { Breadcrumb } from '../../models';
import {
  BreadcrumbsQualifier,
  BreadcrumbsResolver,
  BreadcrumbsResolvers,
  BreadcrumbsService,
} from './breadcrumbs.service';

export class DefaultBreadcrumbsService implements BreadcrumbsService {
  protected routerService = resolve(RouterService);

  constructor(protected injector = inject(INJECTOR)) {}

  protected homeBreadcrumb = {
    i18n: { token: 'breadcrumbs.home' },
    url: '/',
  };

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

  protected mapBreadcrumbs(breadcrumbs: Breadcrumb[]): Breadcrumb[] {
    return [this.homeBreadcrumb, ...breadcrumbs];
  }

  protected resolveBreadcrumbs(type = 'DEFAULT'): Observable<Breadcrumb[]> {
    const key = this.getResolverKey(type);
    return this.injector.inject<BreadcrumbsResolver>(key)
      .resolve()
      .pipe(map((breadcrumbs) => this.mapBreadcrumbs(breadcrumbs)));
  }

  get(qualifier?: BreadcrumbsQualifier): Observable<Breadcrumb[]> {
    return this.resolveType(qualifier).pipe(
      switchMap((type) => {
        try {
          return this.resolveBreadcrumbs(String(type).toUpperCase())
        } catch {
          //Fallback breadcrumbs
          return this.resolveBreadcrumbs()
        }
      })
    );
  }
}
