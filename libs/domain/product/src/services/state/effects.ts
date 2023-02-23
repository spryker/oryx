import { provideEffect } from '@spryker-oryx/core';
import { ProductsLoaded } from './events';
import { ProductQuery } from './queries';

export const productEffects = [
  provideEffect([
    ProductsLoaded,
    (event: any, query: any) =>
      event.data?.products?.forEach((product: any) =>
        query
          .getQuery(ProductQuery)
          ?.set({ data: product, qualifier: { sku: product.sku } })
      ),
  ]),
];
