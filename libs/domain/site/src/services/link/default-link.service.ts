import { inject } from '@spryker-oryx/di';
import { ProductQualifier } from '@spryker-oryx/product';
import { BASE_ROUTE, RouteType, RouterService } from '@spryker-oryx/router';
import { isRouterPath } from '@spryker-oryx/router/lit';
import { Observable, of, switchMap, throwError } from 'rxjs';
import { LinkOptions, LinkService } from './link.service';

export class DefaultLinkService implements LinkService {
  constructor(
    protected baseRoute = inject(BASE_ROUTE, ''),
    protected routerService = inject(RouterService)
  ) {}

  get(link: LinkOptions): Observable<string | undefined> {
    return this.routerService.getRoutes().pipe(
      switchMap((routes) => {
        const route =
          routes?.find((route) => route.type === link.type) ??
          routes?.find((route) => route.type === RouteType.Page);

        if (!route || !isRouterPath(route)) {
          return throwError(() => new Error('Link type is not supported'));
        }

        let dynamicId = '';

        if (link.qualifier && !link.id) {
          // TODO: hardcoded for product for now, let's improve and make it generic
          dynamicId = link.id =
            `${encodeURIComponent((link.qualifier as ProductQualifier).sku!)}` +
            ((link.qualifier as ProductQualifier).offer
              ? `,${encodeURIComponent(
                  (link.qualifier as ProductQualifier).offer!
                )}`
              : '');
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

  private getUrlParams(params: Record<string, string>): string {
    const encodedParams = Object.fromEntries(
      Object.entries(params).map(([k, v]) => [k, encodeURIComponent(v)])
    );

    return new URLSearchParams(encodedParams).toString();
  }
}
