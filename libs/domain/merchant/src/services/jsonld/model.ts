import { OfferJSONLD } from '@spryker-oryx/product';
import { JSONLD } from '@spryker-oryx/site';

export interface AggregateOfferJSONLD extends JSONLD {
  '@context'?: 'http://schema.org';
  '@type': 'AggregateOffer';
  lowPrice: number | string; // Represents the lowest price among the offers
  highPrice: number | string; // Represents the highest price among the offers
  priceCurrency: string; // Currency of the prices
  availability?: string; // Availability status of the aggregate offer
  offerCount: number; // Total count of offers included in the aggregate
  offers: OfferJSONLD[]; // Array of individual Offer objects
}
