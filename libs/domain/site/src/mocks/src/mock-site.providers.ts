import { ErrorHandler } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import {
  DefaultLocaleService,
  LocaleAdapter,
  LocaleService,
} from '@spryker-oryx/i18n';
import {
  BreadcrumbsService,
  CountryService,
  CurrencyService,
  DefaultCountryService,
  DefaultCurrencyService,
  DefaultLinkService,
  DefaultNotificationService,
  DefaultPricingService,
  DefaultSalutationService,
  LinkService,
  NotificationService,
  PricingService,
  SalutationService,
  SapiLocaleAdapter,
  SiteErrorHandler,
  StoreService,
} from '@spryker-oryx/site';
import { MockBreadcrumbsService } from './mock-breadcrumbs.service';
import { MockStoreService } from './mock-store.service';

export const mockSiteProviders: Provider[] = [
  {
    provide: 'SCOS_BASE_URL',
    useValue: '',
  },
  {
    provide: 'STORE',
    useValue: '',
  },
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
    provide: LocaleAdapter,
    useClass: SapiLocaleAdapter,
  },
  {
    provide: PricingService,
    useClass: DefaultPricingService,
  },
  {
    provide: LinkService,
    useClass: DefaultLinkService,
  },
  {
    provide: NotificationService,
    useClass: DefaultNotificationService,
  },
  {
    provide: ErrorHandler,
    useClass: SiteErrorHandler,
  },
  {
    provide: BreadcrumbsService,
    useClass: MockBreadcrumbsService,
  },
];
