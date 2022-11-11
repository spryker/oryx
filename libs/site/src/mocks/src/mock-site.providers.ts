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
  DefaultSalutationService,
  DefaultSemanticLinkService,
  LocaleService,
  NotificationService,
  PricingService,
  SalutationService,
  SemanticLinkService,
  SiteErrorHandler,
  StoreService,
} from '@spryker-oryx/site';
import { MockStoreService } from './mock-store.service';

export const mockSiteProviders: Provider[] = [
  {
    provide: SalutationService,
    useClass: DefaultSalutationService,
  },
  {
    provide: StoreService,
    useClass: MockStoreService,
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
    provide: SemanticLinkService,
    useClass: DefaultSemanticLinkService,
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
