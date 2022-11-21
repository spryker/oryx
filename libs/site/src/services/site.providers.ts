import { ErrorHandler } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/injector';
import { DefaultStoreAdapter, StoreAdapter, storeNormalizer } from './adapter';
import { componentsProvider } from './components.provider';
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
  interface ImportMetaEnv {
    readonly SCOS_BASE_URL: string;
    readonly STORE: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

export const siteProviders: Provider[] = [
  componentsProvider,
  {
    provide: 'SCOS_BASE_URL',
    useValue: import.meta.env?.SCOS_BASE_URL || '',
  },
  {
    provide: 'STORE',
    useValue: import.meta.env?.STORE || '',
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
];
