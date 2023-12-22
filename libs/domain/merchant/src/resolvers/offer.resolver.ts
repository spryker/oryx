import {
  BaseResolver,
  ContextService,
  ResolvedResult,
  Resolver,
  TokenResolverOptions,
} from '@spryker-oryx/core';
import { Provider, inject } from '@spryker-oryx/di';
import {
  ProductContext,
  ProductQualifier,
  ProductService,
  ProductTokenResourceResolverToken,
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
        .get<ProductQualifier>(
          options?.contextElement ?? null,
          ProductContext.SKU
        )
        .pipe(
          switchMap((qualifier) => this.productService.get(qualifier!)),
          map((product) => (product?.offers ?? []).length > 1)
        );
    },
  };
}

export const offerResolvers: Provider[] = [
  {
    provide: ProductTokenResourceResolverToken,
    //     asyncClass: () =>
    //       import('@spryker-oryx/merchant/services').then((m) => m.CartResolver),
    //   },
    //     {
    //     provide: `${BreadcrumbResolvers}${RouteType.Product}`,
    useClass: OfferResolver,
  },
];
