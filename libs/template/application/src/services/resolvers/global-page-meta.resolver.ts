import {
  ElementResolver,
  PageMetaResolver,
  ResolverScore,
} from '@spryker-oryx/core';
import { Observable, of } from 'rxjs';

export class GlobalPageMetaResolver implements PageMetaResolver {
  getScore(): Observable<number> {
    return of(ResolverScore.Default);
  }

  resolve(): Observable<ElementResolver> {
    return of({
      viewport: 'width=device-width, initial-scale=1.0',
      title: 'Composable Storefront',
    });
  }
}
