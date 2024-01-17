import {
  OfferJSONLD,
  OfferJsonLdNormalizer,
  Product,
} from '@spryker-oryx/product';
import { JSONLD } from '@spryker-oryx/site';
import { Observable, of } from 'rxjs';
import { ProductOffer } from '../../models';
import { AggregateOfferJSONLD } from './';

export class MerchantOffersJsonLdNormalizer extends OfferJsonLdNormalizer {
  transform(product: Product): Observable<Partial<JSONLD> | undefined> {
    if (!product?.offers) return super.transform(product);

    const offerPrices = product.offers.map((offer) =>
      offer.price.defaultPrice
        ? offer.price.defaultPrice.value
        : offer.price.originalPrice?.value ?? 0
    );

    const availability = this.resolveAvailability(product.availability);
    return of({
      offers: {
        '@type': 'AggregateOffer',
        offerCount: product.offers.length,
        lowPrice: Math.min(...offerPrices) / 100,
        highPrice: Math.max(...offerPrices) / 100,
        priceCurrency: product.offers[0].price.defaultPrice?.currency,
        availability,
        offers: this.resolveOffers(product.offers),
      } as AggregateOfferJSONLD,
    });
  }

  protected resolveOffers(offers: ProductOffer[]): Partial<OfferJSONLD>[] {
    return offers.map((offer) => super.mapOffer(offer.price)!);
  }
}
