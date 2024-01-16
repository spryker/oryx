import {
  OfferJSONLD,
  OfferJsonLdNormalizer,
  Product,
} from '@spryker-oryx/product';
import { JSONLD } from '@spryker-oryx/site';
import { Observable, of } from 'rxjs';
import { ProductOffer } from '../../models';
import { AggregateOfferJSONLD } from './';
//
// export function MerchantOffersJsonLdNormalizer(
//   product: Product
// ): Observable<JSONLD | undefined> {
//   if (!product.offers) return;
//
//   const offerPrices = product.offers.map((offer) =>
//     offer.price.defaultPrice
//       ? offer.price.defaultPrice.value
//       : offer.price.originalPrice?.value ?? 0
//   );
//
//   const availability = resolveAvailability(product.availability);
//   return of({
//     '@context': 'http://schema.org',
//     '@type': 'AggregateOffer',
//     offerCount: product.offers.length,
//     lowPrice: Math.min(...offerPrices) / 100,
//     highPrice: Math.max(...offerPrices) / 100,
//     priceCurrency: product.offers[0].price.defaultPrice?.currency,
//     availability,
//     offers: this.resolveOffers(product.offers),
//   } as AggregateOfferJSONLD);
// }
//
// function resolveAvailability(
//   availability?: ProductAvailability
// ): string | number | boolean | undefined {
//   if (!availability) return;
//
//   if (availability.quantity && availability.quantity > 0) {
//     return availability.quantity;
//   }
//
//   return availability.isNeverOutOfStock ?? availability.availability;
// }
//
// function resolveOffers(offers: ProductOffer[]): OfferJSONLD[] {
//   return offers.map((offer) => super.mapOffer(offer.price)!);
// }

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
