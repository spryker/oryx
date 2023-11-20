import {
  ElementResolver,
  PageMetaResolver,
  ResolverScore,
} from '@spryker-oryx/core';
import { featureVersion } from '@spryker-oryx/utilities';
import { Observable, of } from 'rxjs';

export class GlobalPageMetaResolver implements PageMetaResolver {
  getScore(): Observable<number> {
    return of(ResolverScore.Fallback);
  }

  resolve(): Observable<ElementResolver> {
    return of({
      ...(featureVersion >= '1.3'
        ? {}
        : { viewport: 'width=device-width, initial-scale=1.0' }),
      title: 'Composable Storefront',
    });
  }
}
