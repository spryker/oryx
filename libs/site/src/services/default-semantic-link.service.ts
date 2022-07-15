import { Observable, of, throwError } from 'rxjs';
import {
  SemanticLink,
  SemanticLinkService,
  SemanticLinkType,
} from './semanticLink.service';

export class DefaultSemanticLinkService implements SemanticLinkService {
  protected types = {
    [SemanticLinkType.Page]: (link: SemanticLink): string =>
      `/${encodeURIComponent(link.id)}`,
    [SemanticLinkType.Product]: (link: SemanticLink): string =>
      `/product/${encodeURIComponent(link.id)}`,
    [SemanticLinkType.Category]: (link: SemanticLink): string =>
      `/category/${link.id}`,
  };

  get(link: SemanticLink): Observable<string | undefined> {
    if (!this.types[link.type]) {
      return throwError(() => new Error('Link type is not supported'));
    }
    return of(this.types[link.type]?.(link));
  }
}
