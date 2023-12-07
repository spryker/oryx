import { Transformer, TransformerService } from '@spryker-oryx/core';
import {
  AvailabilityNormalizer,
  DeserializedProduct,
  PriceNormalizer,
  Product,
  ProductOffer,
} from '@spryker-oryx/product';
import { Observable, combineLatest, map, of } from 'rxjs';
import { ApiMerchantModel } from '../../../models';
import { MerchantNormalizer } from '../merchant.adapter';

export const OfferNormalizer = 'oryx.OfferNormalizer*';

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

export function productOfferNormalizer(
  data: DeserializedProduct, // source
  transformer: TransformerService
): Observable<Partial<Product>> {
  const offers = data.productOffers as any as ApiMerchantModel.ProductOffer[];

  if (!offers?.length) return of({});

  return combineLatest(
    offers.map((offer) => transformer.transform(offer, OfferNormalizer))
  ).pipe(
    map((offers) => {
      const defaultOffer = offers.find((offer) => offer.isDefault);
      const price = defaultOffer?.price;
      return { offers, ...(price ? { price } : {}) };
    })
  );
}

declare global {
  interface InjectionTokensContractMap {
    [OfferNormalizer]: Transformer<ProductOffer>;
  }
}
