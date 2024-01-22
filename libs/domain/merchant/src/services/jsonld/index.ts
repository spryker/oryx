import { Provider } from '@spryker-oryx/di';

import { ProductOfferJsonLdNormalizers } from '@spryker-oryx/product';
import { MerchantOffersJsonLdNormalizer } from './offers.jsonld';

export * from './model';
export * from './offers.jsonld';

export const merchantJsonLdNormalizers: Provider[] = [
  {
    provide: ProductOfferJsonLdNormalizers,
    useClass: MerchantOffersJsonLdNormalizer,
  },
];
