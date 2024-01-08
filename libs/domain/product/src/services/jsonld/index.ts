import { Provider } from '@spryker-oryx/di';
import { ProductJsonLdNormalizer } from './product.jsonld';

import { JsonLdNormalizer } from '@spryker-oryx/site';
import { PRODUCT } from '../../entity';
import { OfferJsonLdNormalizer } from './offer.jsonld';

export * from './model';
export * from './offer.jsonld';
export * from './product.jsonld';

export const ProductJsonLdNormalizers = `${JsonLdNormalizer}${PRODUCT}*`;
export const ProductBaseJsonLdNormalizer = `${ProductJsonLdNormalizers}Base`;
export const ProductOfferJsonLdNormalizers = `${ProductJsonLdNormalizers}Offer`;

export const productJsonLdNormalizers: Provider[] = [
  {
    provide: ProductBaseJsonLdNormalizer,
    useClass: ProductJsonLdNormalizer,
  },
  {
    provide: ProductOfferJsonLdNormalizers,
    useClass: OfferJsonLdNormalizer,
  },
];
