import { ErrorHandler, injectEnv } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import { DefaultStoreAdapter, StoreAdapter, storeNormalizer } from './adapter';
import { CountryService, DefaultCountryService } from './country';
import { CurrencyService, DefaultCurrencyService } from './currency';
import { SiteErrorHandler } from './error-handling';
import { DefaultLocaleService, LocaleService } from './locale';
import {
  DefaultNotificationService,
  NotificationService,
} from './notification';
import { DefaultPricingService, PricingService } from './pricing';
import { DefaultSalutationService, SalutationService } from './salutation';
import {
  DefaultSemanticLinkService,
  SemanticLinkService,
} from './semantic-link';
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
  // TODO: uncomment when CORs header issue is fixed
  // {
  //   provide: HttpInterceptor,
  //   useClass: StoreInterceptor,
  // },
];
