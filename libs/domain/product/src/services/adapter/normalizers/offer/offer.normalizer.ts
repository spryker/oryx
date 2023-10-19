import { Transformer, TransformerService } from '@spryker-oryx/core';
import { AvailabilityNormalizer, PriceNormalizer } from '@spryker-oryx/product';
import { Observable, map } from 'rxjs';
import { ApiProductModel, ProductOffer } from '../../../../models';

export const OfferNormalizer = 'oryx.OfferNormalizer*';

export function offerNormalizer(
  data: ApiProductModel.ProductOffer
): ProductOffer {
  return {
    id: data.id,
    merchant: {
      id: data.merchants?.[0]?.id,
      name: data.merchants?.[0]?.merchantName,
      url: data.merchants?.[0]?.merchantUrl,
    },
  } as ProductOffer;
}

export function offerPriceNormalizer(
  data: ApiProductModel.ProductOffer,
  transformer: TransformerService
): Observable<Partial<ProductOffer>> {
  return transformer
    .transform(data.productOfferPrices?.[0], PriceNormalizer)
    .pipe(map((price) => ({ price })));
}

export function offerAvailabilityNormalizer(
  data: ApiProductModel.ProductOffer,
  transformer: TransformerService
): Observable<Partial<ProductOffer>> {
  return transformer
    .transform(data.productOfferAvailabilities?.[0], AvailabilityNormalizer)
    .pipe(map((availability) => ({ availability })));
}

declare global {
  interface InjectionTokensContractMap {
    [OfferNormalizer]: Transformer<ProductOffer>;
  }
}
