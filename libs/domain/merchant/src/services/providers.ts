import { provideEntity } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import { provideExperienceData } from '@spryker-oryx/experience';
import { merchantListNormalizer } from '@spryker-oryx/merchant/services';
import { MERCHANT } from '../entity';
import {
  merchantHeaderNavigation,
  merchantOffersOnPDP,
  merchantPage,
  merchantSoldToOnPDP,
} from '../presets';
import {
  MerchantAdapter,
  MerchantListNormalizer,
  MerchantNormalizer,
  OfferNormalizer,
  merchantIncludes,
} from './adapter';
import { merchantJsonLdNormalizers } from './jsonld';
import { merchantContextProviders } from './merchant.context';
import { MerchantService } from './merchant.service';
import { merchantQueries, merchantsEffects } from './state';

export const merchantProviders: Provider[] = [
  {
    provide: OfferNormalizer,
    useValue: () =>
      import('@spryker-oryx/merchant/services').then((m) => m.offerNormalizer),
  },
  {
    provide: OfferNormalizer,
    useValue: () =>
      import('@spryker-oryx/merchant/services').then(
        (m) => m.offerPriceNormalizer
      ),
  },
  {
    provide: OfferNormalizer,
    useValue: () =>
      import('@spryker-oryx/merchant/services').then(
        (m) => m.offerAvailabilityNormalizer
      ),
  },
  {
    provide: OfferNormalizer,
    useValue: () =>
      import('@spryker-oryx/merchant/services').then(
        (m) => m.offerMerchantNormalizer
      ),
  },
  {
    provide: MerchantAdapter,
    asyncClass: () =>
      import('@spryker-oryx/merchant/services').then(
        (m) => m.DefaultMerchantAdapter
      ),
  },
  {
    provide: MerchantService,
    asyncClass: () =>
      import('@spryker-oryx/merchant/services').then(
        (m) => m.DefaultMerchantService
      ),
  },
  {
    provide: MerchantNormalizer,
    useValue: () =>
      import('@spryker-oryx/merchant/services').then(
        (m) => m.merchantNormalizer
      ),
  },

  {
    provide: MerchantListNormalizer,
    useValue: merchantListNormalizer,
  },
  ...merchantQueries,
  ...merchantsEffects,
  ...merchantIncludes,
  ...merchantContextProviders,
  provideEntity(MERCHANT, {
    service: MerchantService,
  }),
  provideExperienceData([
    merchantPage,
    merchantHeaderNavigation,
    merchantOffersOnPDP,
    merchantSoldToOnPDP,
  ]),
  ...merchantJsonLdNormalizers,
];
