import { ErrorHandler, HttpInterceptor, injectEnv } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import { LocaleAdapter } from '@spryker-oryx/i18n';
import { DefaultStoreAdapter, StoreAdapter, storeNormalizer } from './adapter';
import { BreadcrumbService, DefaultBreadcrumbService } from './breadcrumb';
import { CountryService, DefaultCountryService } from './country';
import {
  CurrencyService,
  CurrentCurrencyInterceptor,
  DefaultCurrencyService,
  currencyHydration,
} from './currency';
import { SiteErrorHandler } from './error-handling';
import { DefaultGenderService, GenderService } from './gender';
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
import { DefaultPricingService, PricingService } from './pricing';
import {
  DefaultFallbackBreadcrumbResolver,
  FallbackBreadcrumbResolver,
} from './resolvers';
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
    useFactory: (): string => {
      const url = injectEnv('SCOS_BASE_URL', '');
      return url.endsWith('/') ? url.slice(0, -1) : url;
    },
  },
  {
    provide: 'STORE',
    useFactory: () => injectEnv('STORE', ''),
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
  {
    provide: GenderService,
    useClass: DefaultGenderService,
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
  {
    provide: BreadcrumbService,
    useClass: DefaultBreadcrumbService,
  },
  {
    provide: FallbackBreadcrumbResolver,
    useClass: DefaultFallbackBreadcrumbResolver,
  },
  // TODO: uncomment when CORs header issue is fixed
  // {
  //   provide: HttpInterceptor,
  //   useClass: StoreInterceptor,
  // },
];
