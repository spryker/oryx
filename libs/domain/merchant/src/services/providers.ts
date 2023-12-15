import { Provider } from '@spryker-oryx/di';
import { ProductNormalizer } from '@spryker-oryx/product';
import { provideLitRoutes } from '@spryker-oryx/router/lit';
import {
  DefaultMerchantAdapter,
  MerchantAdapter,
  merchantIncludes,
  MerchantNormalizer,
  OfferNormalizer,
  productOfferNormalizer,
} from './adapter';
import { merchantNormalizer } from './adapter/normalizers';
import {
  offerAvailabilityNormalizer,
  offerMerchantNormalizer,
  offerNormalizer,
  offerPriceNormalizer,
} from './adapter/normalizers/offer.normalizer';
import { DefaultMerchantService } from './default-merchant.service';
import { MerchantContextFallback } from './merchant.context';
import { MerchantService } from './merchant.service';
import { merchantRoutes } from './routes';
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
    provide: ProductNormalizer,
    useValue: productOfferNormalizer,
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
  ...merchantQueries,
  MerchantContextFallback,
  ...provideLitRoutes({ routes: merchantRoutes }),
  ...merchantsEffects,
  ...merchantIncludes,
];
