import {
  ElementResolver,
  PageMetaResolver,
  ResolverScore,
} from '@spryker-oryx/core';
import { Observable, of } from 'rxjs';

export class GlobalPageMetaResolver implements PageMetaResolver {
  getScore(): Observable<number> {
    return of(ResolverScore.Fallback);
  }

  resolve(): Observable<ElementResolver> {
    return of({
      title: 'Composable Storefront',
    });
  }
}
