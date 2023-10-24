import { Transformer, TransformerService } from '@spryker-oryx/core';
import { AvailabilityNormalizer, PriceNormalizer } from '@spryker-oryx/product';
import { Observable, map } from 'rxjs';
import { ApiMerchantModel } from '../../../../merchant/merchant.model.api';
import { ProductOffer } from '../../../../models';

export const OfferNormalizer = 'oryx.OfferNormalizer*';

export function offerNormalizer(
  data: ApiMerchantModel.ProductOffer
): ProductOffer {
  return {
    id: data.id,
    isDefault: data.isDefault,
    merchant: {
      id: data.merchants?.[0]?.id,
      name: data.merchants?.[0]?.merchantName,
      url: data.merchants?.[0]?.merchantUrl,
      deliveryTime: data.merchants?.[0]?.deliveryTime,
    },
  } as ProductOffer;
}

export function offerPriceNormalizer(
  data: ApiMerchantModel.ProductOffer,
  transformer: TransformerService
): Observable<Partial<ProductOffer>> {
  return transformer
    .transform(data.productOfferPrices?.[0], PriceNormalizer)
    .pipe(map((price) => ({ price })));
}

export function offerAvailabilityNormalizer(
  data: ApiMerchantModel.ProductOffer,
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
