import { ClassTransformer } from '@spryker-oryx/core';
import { JSONLD } from '@spryker-oryx/site';
import { Observable, of } from 'rxjs';
import {
  Product,
  ProductAvailability,
  ProductPrice,
  ProductPrices,
} from '../../models';
import { OfferJSONLD } from './';

export class OfferJsonLdNormalizer
  implements ClassTransformer<JSONLD, Product>
{
  transform(product: Product): Observable<Partial<JSONLD> | undefined> {
    if (!product.price) return of(undefined);
    return of({
      offers: this.mapOffer(
        product.price,
        this.resolveAvailability(product.availability)
      ),
    } as Partial<JSONLD>);
  }

  protected mapOffer(
    prices: ProductPrices,
    availability?: string | number | boolean
  ): Partial<OfferJSONLD> | undefined {
    const defaultPrice = prices?.defaultPrice;
    const originalPrice = prices?.originalPrice;

    const fromPrice = originalPrice ?? defaultPrice;

    if (!fromPrice) return;
    const discountPrice =
      defaultPrice && defaultPrice !== fromPrice
        ? { discount: this.mapPrice(defaultPrice) }
        : {};
    return {
      ...this.mapPrice(fromPrice, availability),
      ...discountPrice,
    } as Partial<OfferJSONLD>;
  }

  protected mapPrice(
    price: ProductPrice,
    availability?: string | number | boolean
  ): Partial<OfferJSONLD> {
    return {
      '@type': 'Offer',
      price: price.value / 100,
      priceCurrency: price.currency,
      availability,
    };
  }

  protected resolveAvailability(
    availability?: ProductAvailability
  ): string | number | boolean | undefined {
    if (!availability) return;

    if (availability.quantity && availability.quantity > 0) {
      return availability.quantity;
    }

    return availability.isNeverOutOfStock ?? availability.availability;
  }
}
