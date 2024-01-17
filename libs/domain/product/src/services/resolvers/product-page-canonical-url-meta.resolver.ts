import {
  ContextService,
  ElementResolver,
  PageMetaResolver,
} from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { LinkService, RouterService } from '@spryker-oryx/router';
import { Observable, combineLatest, map, of, switchMap } from 'rxjs';
import { PRODUCT } from '../../entity';

export class ProductPageCanonicalUrlResolver implements PageMetaResolver {
  protected context = inject(ContextService);
  protected router = inject(RouterService);
  protected linkService = inject(LinkService);

  getScore(): Observable<unknown[]> {
    return combineLatest([
      this.context.get(null, PRODUCT),
      this.router
        .currentRoute()
        .pipe(map((route) => route.includes('product'))),
    ]);
  }

  resolve(): Observable<ElementResolver> {
    return this.context.get(null, PRODUCT).pipe(
      switchMap((qualifier) => {
        if (!qualifier?.sku && !qualifier?.offer) return of({});

        return this.linkService
          .get({ type: PRODUCT, qualifier: { sku: qualifier.sku } })
          .pipe(
            map((link) => ({
              canonical: `${globalThis.location.origin}${link}`,
            }))
          );
      })
    );
  }
}
