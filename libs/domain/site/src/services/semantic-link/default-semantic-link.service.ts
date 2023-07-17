import { inject } from '@spryker-oryx/di';
import { BASE_ROUTE, RouterService } from '@spryker-oryx/router';
import { Observable, of, throwError } from 'rxjs';
import { SemanticLink, SemanticLinkService } from './semantic-link.service';
import { RouteLinkType, isRouterPath } from '@spryker-oryx/router/lit';

export class DefaultSemanticLinkService implements SemanticLinkService {
  protected types = {
    // [SemanticLinkType.AddressList]: (): string => `/my-account/addresses`,
    // [SemanticLinkType.AddressBookCreate]: (): string =>
    //   `/my-account/addresses/create`,
    // [SemanticLinkType.AddressBookEdit]: (link: SemanticLink): string =>
    //   `/my-account/addresses/edit/${link.id}`,
  };

  constructor(
    protected baseRoute = inject(BASE_ROUTE, ''),
    protected routerService = inject(RouterService)
  ) {}

  get(link: SemanticLink): Observable<string | undefined> {
    const routes = this.routerService.getRoutes();
    const route =
      routes?.find((route) => route.type === link.type) ??
      routes?.find((route) => route.type === RouteLinkType.Page);

    if (!route || !isRouterPath(route)) {
      return throwError(() => new Error('Link type is not supported'));
    }

    const dynamicId =
      route.type === RouteLinkType.Page
        ? encodeURIComponent(link.type)
        : encodeURIComponent(link.id ?? '');
    const dynamicParams = link.params
      ? `?${this.getUrlParams(link.params)}`
      : '';
    const parts = route.path.split('/');
    parts.pop();
    const path = `${parts.join('/')}${
      dynamicId ? `/${dynamicId}` : ''
    }${dynamicParams}`;

    return of(`${this.baseRoute}${path}`);
  }

  private getUrlParams(params: Record<string, string>): string {
    const encodedParams = Object.fromEntries(
      Object.entries(params).map(([k, v]) => [k, encodeURIComponent(v)])
    );

    return new URLSearchParams(encodedParams).toString();
  }
}
