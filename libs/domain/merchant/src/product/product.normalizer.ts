import { TransformerService } from '@spryker-oryx/core';
import {
  ApiMerchantModel,
  DeserializedMerchantProduct,
  OfferNormalizer,
} from '@spryker-oryx/merchant';
import { Product } from '@spryker-oryx/product';
import { Observable, combineLatest, map, of } from 'rxjs';

export function productOfferNormalizer(
  data: DeserializedMerchantProduct, // source
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
