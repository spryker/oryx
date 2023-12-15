import { provideQuery, QueryOptions } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import {
  Product,
  ProductAdapter,
  ProductQualifier,
  ProductQuery,
  productQueryFactory,
} from '@spryker-oryx/product';

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

export function productOfferQueryFactory(
  adapter = inject(ProductAdapter)
): QueryOptions<Product, ProductQualifier> {
  return {
    ...productQueryFactory(adapter),
    postTransforms: [productForOfferTransform],
  };
}

export const productOfferQueries = [
  provideQuery(ProductQuery, productOfferQueryFactory),
];
