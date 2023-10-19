import { provideQuery, Query } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { LocaleChanged } from '@spryker-oryx/i18n';
import { CurrencyChanged } from '@spryker-oryx/site';
import { Product, ProductQualifier } from '../../models';
import { ProductAdapter } from '../adapter';

export const ProductQuery = 'oryx.productQuery';

export type ProductQuery = Query<Product, ProductQualifier>;

export const productQueries = [
  provideQuery(ProductQuery, (adapter = inject(ProductAdapter)) => ({
    loader: (q: ProductQualifier) => adapter.get(q),
    refreshOn: [LocaleChanged, CurrencyChanged],
    postTransforms: [
      (data: Product, qualifier: ProductQualifier) => {
        if (data && qualifier.offer) {
          console.log(data, qualifier);
          return {
            ...data,
            price: {
              ...data.price,
              defaultPrice: {
                ...data.price?.defaultPrice,
                value:
                  data.offers?.find((o) => o.id === qualifier.offer)?.price ??
                  data.price?.defaultPrice?.value,
              },
            },
          };
        }
      },
    ],
    // qualifierEnhancers: [(q: ProductQualifier) => ({ ...q, offer: '12321' })],
    cacheKey: (q: ProductQualifier) => q?.sku ?? '',
  })),
];
