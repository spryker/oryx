import { ErrorHandler, HttpInterceptor, injectEnv } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import { LocaleAdapter } from '@spryker-oryx/i18n';
import { DefaultStoreAdapter, StoreAdapter, storeNormalizer } from './adapter';
import { CountryService, DefaultCountryService } from './country';
import {
  currencyHydration,
  CurrencyService,
  CurrentCurrencyInterceptor,
  DefaultCurrencyService,
} from './currency';
import { SiteErrorHandler } from './error-handling';
import {
  AcceptLanguageInterceptor,
  localeHydration,
  SapiLocaleAdapter,
} from './locale';
import {
  DefaultNotificationService,
  NotificationService,
} from './notification';
import { DefaultPricingService, PricingService } from './pricing';
import { DefaultSalutationService, SalutationService } from './salutation';
import { DefaultLinkService, LinkService } from './link';
import { DefaultStoreService, StoreService } from './store';
import { BreadcrumbsService, DefaultBreadcrumbsService } from './breadcrumbs';

declare global {
  interface AppEnvironment {
    readonly SCOS_BASE_URL?: string;
    readonly STORE?: string;
  }
}

export const siteProviders: Provider[] = [
  {
    provide: 'SCOS_BASE_URL',
    useFactory: () => injectEnv('SCOS_BASE_URL', ''),
  },
  {
    provide: 'STORE',
    useFactory: () => injectEnv('STORE', ''),
  },
  {
    provide: BreadcrumbsService,
    useClass: DefaultBreadcrumbsService,
  },
  {
    provide: LinkService,
    useClass: DefaultLinkService,
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
    provide: CountryService,
    useClass: DefaultCountryService,
  },
  {
    provide: CurrencyService,
    useClass: DefaultCurrencyService,
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
    provide: NotificationService,
    useClass: DefaultNotificationService,
  },
  {
    provide: ErrorHandler,
    useClass: SiteErrorHandler,
  },
  {
    provide: SalutationService,
    useClass: DefaultSalutationService,
  },
  ...storeNormalizer,
  {
    provide: HttpInterceptor,
    useClass: AcceptLanguageInterceptor,
  },
  {
    provide: HttpInterceptor,
    useClass: CurrentCurrencyInterceptor,
  },
  localeHydration,
  currencyHydration,
  // TODO: uncomment when CORs header issue is fixed
  // {
  //   provide: HttpInterceptor,
  //   useClass: StoreInterceptor,
  // },
];
