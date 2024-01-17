import { TransformerService } from '@spryker-oryx/core';
import { ApiMerchantModel, OfferNormalizer } from '@spryker-oryx/merchant';
import { Product } from '@spryker-oryx/product';
import { Observable, combineLatest, map, of } from 'rxjs';
import { DeserializedMerchantProduct } from '../adapter';

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
