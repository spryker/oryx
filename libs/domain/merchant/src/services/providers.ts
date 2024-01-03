import { provideEntity } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import { provideExperienceData } from '@spryker-oryx/experience';
import { MERCHANT } from '../entity';
import {
  merchantOffersOnPDP,
  merchantPage,
  merchantSoldToOnPDP,
} from '../presets';
import {
  DefaultMerchantAdapter,
  MerchantAdapter,
  MerchantListNormalizer,
  MerchantNormalizer,
  OfferNormalizer,
  merchantIncludes,
} from './adapter';
import {
  merchantListNormalizer,
  merchantNormalizer,
} from './adapter/normalizers';
import {
  offerAvailabilityNormalizer,
  offerMerchantNormalizer,
  offerNormalizer,
  offerPriceNormalizer,
} from './adapter/normalizers/offer.normalizer';
import { DefaultMerchantService } from './default-merchant.service';
import { merchantContextProviders } from './merchant.context';
import { MerchantService } from './merchant.service';
import { merchantQueries, merchantsEffects } from './state';

export const merchantProviders: Provider[] = [
  {
    provide: OfferNormalizer,
    useValue: offerNormalizer,
  },
  {
    provide: OfferNormalizer,
    useValue: offerPriceNormalizer,
  },
  {
    provide: OfferNormalizer,
    useValue: offerAvailabilityNormalizer,
  },
  {
    provide: OfferNormalizer,
    useValue: offerMerchantNormalizer,
  },
  {
    provide: MerchantAdapter,
    useClass: DefaultMerchantAdapter,
  },
  {
    provide: MerchantService,
    useClass: DefaultMerchantService,
  },
  {
    provide: MerchantNormalizer,
    useValue: merchantNormalizer,
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
    merchantOffersOnPDP,
    merchantSoldToOnPDP,
  ]),
];
