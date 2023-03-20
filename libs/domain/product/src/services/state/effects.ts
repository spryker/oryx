import { provideEffect } from '@spryker-oryx/core';
import { ProductsLoaded } from './events';
import { ProductQuery } from './queries';

export const productEffects = [
  provideEffect<ProductsLoaded>([
    ProductsLoaded,
    ({ event, query }) => {
      event.data?.products?.forEach((product) =>
        query
          .getQuery<ProductQuery>(ProductQuery)
          ?.set({ data: product, qualifier: { sku: product.sku } })
      );
    },
  ]),
];
