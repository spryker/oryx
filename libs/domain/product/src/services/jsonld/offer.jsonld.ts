import { JSONLD, JsonLdNormalizer } from '@spryker-oryx/site';
import { Observable, of } from 'rxjs';
import {
  Product,
  ProductAvailability,
  ProductPrice,
  ProductPrices,
} from '../../models';
import { OfferJSONLD } from './';

export class OfferJsonLdNormalizer implements JsonLdNormalizer<Product> {
  normalize(product: Product): Observable<JSONLD | undefined> {
    if (!product.price) return of(undefined);
    return of(
      this.mapOffer(
        product.price,
        this.resolveAvailability(product.availability)
      )
    );
  }

  protected mapOffer(
    prices: ProductPrices,
    availability?: string | number | boolean
  ): OfferJSONLD | undefined {
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
    };
  }

  protected mapPrice(
    price: ProductPrice,
    availability?: string | number | boolean
  ): OfferJSONLD {
    return {
      '@context': 'http://schema.org',
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
