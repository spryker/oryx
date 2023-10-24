import { provideQuery, Query } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { LocaleChanged } from '@spryker-oryx/i18n';
import { CurrencyChanged } from '@spryker-oryx/site';
import { Product, ProductQualifier } from '../../models';
import { ProductAdapter } from '../adapter';
import { ProductLoaded } from './events';

export const ProductQuery = 'oryx.productQuery';

export type ProductQuery = Query<Product, ProductQualifier>;

/**
 * This transform is used to update details (like price) of the product when specific offer is requested.
 */
export function productForOfferTransform(
  data: Product,
  qualifier: ProductQualifier
): Product | void {
  if (data && data.offers?.length) {
    const selectedOffer = qualifier.offer
      ? data.offers?.find((o) => o.id === qualifier.offer)
      : data.offers?.find((o) => o.isDefault);
    return {
      ...data,
      merchantId: selectedOffer?.merchant?.id ?? undefined,
      price: selectedOffer?.price ?? data.price,
      availability: selectedOffer?.availability ?? data.availability,
    };
  }
}

export const productQueries = [
  provideQuery(ProductQuery, (adapter = inject(ProductAdapter)) => ({
    cacheKey: (q: ProductQualifier) => q?.sku ?? '',
    loader: (q: ProductQualifier) => adapter.get(q),
    onLoad: [ProductLoaded],
    refreshOn: [LocaleChanged, CurrencyChanged],
    postTransforms: [productForOfferTransform],
  })),
];
