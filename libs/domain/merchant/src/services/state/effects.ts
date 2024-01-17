import { provideEffect, QueryService } from '@spryker-oryx/core';
import { ProductLoaded, ProductsLoaded } from '@spryker-oryx/product';
import { ProductOffer } from '../../models';
import { MerchantQuery } from './queries';

function setMerchant(query: QueryService, offer: ProductOffer) {
  query.getQuery<MerchantQuery>(MerchantQuery)?.set({
    data: offer.merchant,
    qualifier: { id: offer.merchant.id },
  });
}

export const merchantsEffects = [
  provideEffect<ProductsLoaded>([
    ProductsLoaded,
    ({ event, query }) => {
      event.data?.products?.forEach((product) =>
        product.offers?.forEach((offer) => setMerchant(query, offer))
      );
    },
  ]),

  provideEffect<ProductLoaded>([
    ProductLoaded,
    ({ event, query }) => {
      event.data?.offers?.forEach((offer) => setMerchant(query, offer));
    },
  ]),
];
