import { Observable, of, throwError } from 'rxjs';
import {
  SemanticLink,
  SemanticLinkService,
  SemanticLinkType,
} from './semantic-link.service';

export class DefaultSemanticLinkService implements SemanticLinkService {
  protected types = {
    // TODO: PLP link generation with search params
    [SemanticLinkType.ProductList]: (link: SemanticLink): string =>
      `/search${
        link.params
          ? `?${encodeURIComponent(this.getUrlParams(link.params))}`
          : encodeURIComponent(link.id ?? '')
      }`,
    [SemanticLinkType.Page]: (link: SemanticLink): string =>
      `/${encodeURIComponent(link.id ?? '')}`,
    [SemanticLinkType.Product]: (link: SemanticLink): string =>
      `/product/${encodeURIComponent(link.id ?? '')}`,
    [SemanticLinkType.Category]: (link: SemanticLink): string =>
      `/category/${link.id}${
        link.params
          ? `?${encodeURIComponent(this.getUrlParams(link.params))}`
          : ''
      }`,
  };

  get(link: SemanticLink): Observable<string | undefined> {
    if (!this.types[link.type]) {
      return throwError(() => new Error('Link type is not supported'));
    }
    return of(this.types[link.type]?.(link));
  }

  private getUrlParams(params: Record<string, string>): string {
    return new URLSearchParams(params).toString();
  }
}
