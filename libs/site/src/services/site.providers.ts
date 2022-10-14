import { Provider } from '@spryker-oryx/injector';
import {
  CountryService,
  CurrencyService,
  DefaultCountryService,
  DefaultCurrencyService,
  DefaultLocaleService,
  DefaultPricingService,
  DefaultSemanticLinkService,
  LocaleService,
  PricingService,
  SemanticLinkService,
} from './index';

export const siteProviders: Provider[] = [
  {
    provide: SemanticLinkService,
    useClass: DefaultSemanticLinkService,
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
];
