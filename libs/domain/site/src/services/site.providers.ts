// import { CartPriceChangeGuard } from '@spryker-oryx/cart';
import { ErrorHandler, HttpInterceptor, injectEnv } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import { LocaleAdapter } from '@spryker-oryx/i18n';
import { DefaultStoreAdapter, StoreAdapter, storeNormalizer } from './adapter';
import { CountryService, DefaultCountryService } from './country';
import {
  CurrencyService,
  CurrentCurrencyInterceptor,
  DefaultCurrencyService,
  currencyHydration,
} from './currency';
import { SiteErrorHandler } from './error-handling';
import { DefaultLinkService, LinkService } from './link';
import {
  AcceptLanguageInterceptor,
  SapiLocaleAdapter,
  localeHydration,
} from './locale';
import {
  DefaultNotificationService,
  NotificationService,
} from './notification';
import {
  DefaultPriceModeService,
  PriceModeInterceptor,
  PriceModeService,
} from './price-mode';
import { priceModeHydration } from './price-mode/price-mode-hydration';
import { DefaultPricingService, PricingService } from './pricing';
import { DefaultSalutationService, SalutationService } from './salutation';
import { DefaultStoreService, StoreService } from './store';

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
    provide: 'SCOS_PRICE_MODE',
    useFactory: () => injectEnv('SCOS_PRICE_MODE', ''),
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
    provide: PriceModeService,
    useClass: DefaultPriceModeService,
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
  {
    provide: HttpInterceptor,
    useClass: PriceModeInterceptor,
  },
  localeHydration,
  currencyHydration,
  priceModeHydration,
  // TODO: uncomment when CORs header issue is fixed
  // {
  //   provide: HttpInterceptor,
  //   useClass: StoreInterceptor,
  // },
];
