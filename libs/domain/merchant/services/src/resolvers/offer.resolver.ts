import {
  BaseResolver,
  ContextService,
  ResolvedResult,
  Resolver,
  TokenResolverOptions,
} from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import {
  PRODUCT,
  ProductQualifier,
  ProductService,
} from '@spryker-oryx/product';
import { Observable, map, switchMap } from 'rxjs';

export type OfferResolvers = {
  OFFERS: Resolver;
};

export class OfferResolver extends BaseResolver<OfferResolvers> {
  protected contextService = inject(ContextService);
  protected productService = inject(ProductService);

  protected resolvers = {
    OFFERS: (options?: TokenResolverOptions): Observable<ResolvedResult> => {
      return this.contextService
        .get<ProductQualifier>(options?.contextElement ?? null, PRODUCT)
        .pipe(
          switchMap((qualifier) => this.productService.get(qualifier!)),
          map((product) => (product?.offers ?? []).length > 1)
        );
    },
  };
}
