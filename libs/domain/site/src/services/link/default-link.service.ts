import { inject } from '@spryker-oryx/di';
import { BASE_ROUTE, RouteType, RouterService } from '@spryker-oryx/router';
import {
  PathRouteConfig,
  RouteConfig,
  isRouterPath,
} from '@spryker-oryx/router/lit';
import { featureVersion } from '@spryker-oryx/utilities';
import { Observable, of, switchMap, throwError } from 'rxjs';
import { LinkOptions, LinkService } from './link.service';

type GenericQualifier = Record<string, string | number | boolean>;

export class DefaultLinkService implements LinkService {
  constructor(
    protected baseRoute = inject(BASE_ROUTE, ''),
    protected routerService = inject(RouterService)
  ) {}

  get(link: LinkOptions): Observable<string | undefined> {
    return this.routerService.getRoutes().pipe(
      switchMap((routes) => {
        const route =
          this.findRoute(routes, link) ??
          this.findRoute(routes, { type: RouteType.Page });

        if (!route || !isRouterPath(route)) {
          return throwError(() => new Error('Link type is not supported'));
        }

        let dynamicId = '';

        if (link.qualifier || !link.id) {
          const path = link.qualifier
            ? this.generatePath(
                (route as PathRouteConfig).path,
                link.qualifier as GenericQualifier
              )
            : (route as PathRouteConfig).path;
          const dynamicParams = link.params
            ? `?${this.getUrlParams(link.params)}`
            : '';

          return of(`${this.baseRoute}${path}${dynamicParams}`);
        } else {
          dynamicId =
            link.type && link.id
              ? encodeURIComponent(link.id)
              : route.type === RouteType.Page
              ? encodeURIComponent(link.type)
              : encodeURIComponent(link.id ?? '');
        }

        const dynamicParams = link.params
          ? `?${this.getUrlParams(link.params)}`
          : '';
        const parts = route.path.split('/');
        if (dynamicId) {
          parts.pop();
        }
        const path = `${parts.join('/')}${
          dynamicId ? `/${dynamicId}` : ''
        }${dynamicParams}`;

        return of(`${this.baseRoute}${path}`);
      })
    );
  }

  isCurrent(url: string, exactMatch?: boolean): Observable<boolean> {
    return this.routerService.currentRoute().pipe(
      switchMap((currentRoute) => {
        if (!currentRoute || !isRouterPath({ path: currentRoute })) {
          return throwError(() => new Error('Current route is not available'));
        }

        const currentUrl = `${this.baseRoute}${currentRoute}`;

        return of(
          currentUrl === url || exactMatch || currentUrl.startsWith(`${url}/`)
        );
      })
    );
  }

  protected findRoute(
    routes: RouteConfig[] = [],
    link: LinkOptions
  ): RouteConfig | undefined {
    if (featureVersion >= '1.4') {
      const filteredRoutes = routes.filter(
        (route) => route.type === link.type && isRouterPath(route)
      ) as PathRouteConfig[];
      return filteredRoutes.find((route) =>
        this.canSatisfyPath(route.path!, link.qualifier as GenericQualifier)
      );
    } else {
      return routes.find((route) => route.type === link.type);
    }
  }

  protected canSatisfyPath(path: string, qualifier: GenericQualifier): boolean {
    if (!qualifier) return true;
    const requiredSegments = path.match(/:\w+/g) || [];
    return requiredSegments.every((segment) =>
      qualifier.hasOwnProperty(segment.substring(1))
    );
  }

  protected generatePath(path: string, qualifier: GenericQualifier) {
    return path.replace(/:\w+/g, (match) => {
      const key = match.substring(1);
      return qualifier.hasOwnProperty(key)
        ? encodeURIComponent(qualifier[key] as string | number | boolean)
        : '';
    });
  }

  private getUrlParams(params: Record<string, string>): string {
    const encodedParams = Object.fromEntries(
      Object.entries(params).map(([k, v]) => [k, encodeURIComponent(v)])
    );

    return new URLSearchParams(encodedParams).toString();
  }
}
