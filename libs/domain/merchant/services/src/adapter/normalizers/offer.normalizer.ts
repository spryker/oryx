import { TransformerService } from '@spryker-oryx/core';
import {
  ApiMerchantModel,
  MerchantNormalizer,
  ProductOffer,
} from '@spryker-oryx/merchant';
import { AvailabilityNormalizer, PriceNormalizer } from '@spryker-oryx/product';
import { Observable, map } from 'rxjs';

export function offerNormalizer(
  data: ApiMerchantModel.ProductOffer
): ProductOffer {
  return {
    id: data.id,
    isDefault: data.isDefault,
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

export function offerMerchantNormalizer(
  data: ApiMerchantModel.ProductOffer,
  transformer: TransformerService
): Observable<Partial<ProductOffer>> {
  return transformer
    .transform(data.merchants?.[0], MerchantNormalizer)
    .pipe(map((merchant) => ({ merchant })));
}
