import { Provider } from '@spryker-oryx/di';

import { jsonLdTokenFactory } from '@spryker-oryx/site';
import { PRODUCT } from '../../entity';
import { OfferJsonLdNormalizer } from './offer.jsonld';
import { ProductJsonLdNormalizer } from './product.jsonld';

export * from './model';
export * from './offer.jsonld';
export * from './product.jsonld';

export const ProductJsonLdNormalizers = jsonLdTokenFactory(PRODUCT);
export const ProductBaseJsonLdNormalizer = jsonLdTokenFactory(PRODUCT, 'Base');
export const ProductOfferJsonLdNormalizers = jsonLdTokenFactory(
  PRODUCT,
  'Offer'
);

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
