import { ErrorHandler } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/injector';
import {
  CountryService,
  CurrencyService,
  DefaultCountryService,
  DefaultCurrencyService,
  DefaultLocaleService,
  DefaultNotificationService,
  DefaultPricingService,
  DefaultSemanticLinkService,
  DefaultStoreAdapter,
  LocaleService,
  NotificationService,
  PricingService,
  SemanticLinkService,
  SiteErrorHandler,
  StoreAdapter,
  StoreNormalizers,
  storeNormalizers,
} from './index';

import { DefaultStoreService, StoreService } from './store';

export const siteProviders: Provider[] = [
  {
    provide: SemanticLinkService,
    useClass: DefaultSemanticLinkService,
  },
  {
    provide: StoreService,
    useClass: DefaultStoreService,
  },

  {
    provide: StoreAdapter,
    useClass: DefaultStoreAdapter,
  },
  {
    provide: StoreNormalizers,
    useValue: storeNormalizers,
  },
  {
    provide: CountryService,
    useClass: DefaultCountryService,
  },
  {
    provide: CurrencyService,
    useClass: DefaultCurrencyService,
  },
  {
    provide: LocaleService,
    useClass: DefaultLocaleService,
  },
  {
    provide: PricingService,
    useClass: DefaultPricingService,
  },
  {
    provide: NotificationService,
    useClass: DefaultNotificationService,
  },
  {
    provide: ErrorHandler,
    useClass: SiteErrorHandler,
  },
];
