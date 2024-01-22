import { JSONLD } from '@spryker-oryx/site';

export interface ProductJSONLD extends JSONLD {
  '@context'?: 'http://schema.org';
  '@type': 'Product';
  name?: string;
  description?: string;
  sku?: string;
  brand?: string;
  image?: string;
  offers?: OfferJSONLD | OfferJSONLD[];
}

export interface OfferJSONLD extends JSONLD {
  '@context'?: 'http://schema.org';
  '@type': 'Offer';
  price: number;
  priceCurrency: string;
  availability?: string | number | boolean;
  validFrom?: string;
  validThrough?: string;
}
