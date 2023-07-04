import { inject } from '@spryker-oryx/di';
import { BASE_ROUTE } from '@spryker-oryx/router';
import { Observable, of, throwError } from 'rxjs';
import {
  SemanticLink,
  SemanticLinkService,
  SemanticLinkType,
} from './semantic-link.service';

export class DefaultSemanticLinkService implements SemanticLinkService {
  protected types = {
    [SemanticLinkType.Article]: (link: SemanticLink): string =>
      `/article/${encodeURIComponent(link.id ?? '')}`,
    [SemanticLinkType.Faq]: (link: SemanticLink): string =>
      `/faq/${encodeURIComponent(link.id ?? '')}`,
    [SemanticLinkType.ProductList]: (link: SemanticLink): string =>
      `/search${
        link.params
          ? `?${this.getUrlParams(link.params)}`
          : encodeURIComponent(link.id ?? '')
      }`,
    [SemanticLinkType.Page]: (link: SemanticLink): string =>
      `/${encodeURIComponent(link.id ?? '')}`,
    [SemanticLinkType.Product]: (link: SemanticLink): string =>
      `/product/${encodeURIComponent(link.id ?? '')}`,
    [SemanticLinkType.Category]: (link: SemanticLink): string =>
      `/category/${link.id}${
        link.params ? `?${this.getUrlParams(link.params)}` : ''
      }`,
    [SemanticLinkType.Cart]: (): string => '/cart',
    [SemanticLinkType.Checkout]: (): string => '/checkout',
    [SemanticLinkType.CheckoutLogin]: (): string => '/checkout',
    [SemanticLinkType.Login]: (): string => '/login',
    [SemanticLinkType.Order]: (link: SemanticLink): string =>
      `/order/${encodeURIComponent(link.id ?? '')}`,
    [SemanticLinkType.AddressList]: (): string => `/my-account/addresses`,
    [SemanticLinkType.AddressBookCreate]: (): string =>
      `/my-account/addresses/create`,
    [SemanticLinkType.AddressBookEdit]: (link: SemanticLink): string =>
      `/my-account/addresses/edit/${link.id}`,
  };

  protected baseRoute = inject(BASE_ROUTE, '');

  get(link: SemanticLink): Observable<string | undefined> {
    if (!this.types[link.type]) {
      return throwError(() => new Error('Link type is not supported'));
    }
    return of(this.baseRoute + this.types[link.type]?.(link));
  }

  private getUrlParams(params: Record<string, string>): string {
    const encodedParams = Object.fromEntries(
      Object.entries(params).map(([k, v]) => [k, encodeURIComponent(v)])
    );

    return new URLSearchParams(encodedParams).toString();
  }
}
