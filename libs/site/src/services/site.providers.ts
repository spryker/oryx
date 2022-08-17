import {
  CurrencyService,
  DefaultCurrencyService,
  DefaultLocaleService,
  DefaultPricingService,
  DefaultSemanticLinkService,
  LocaleService,
  PricingService,
  SemanticLinkService,
} from './index';

export const semanticLinkProviders = [
  {
    provide: SemanticLinkService,
    useClass: DefaultSemanticLinkService,
  },
];

export const siteProviders = [
  ...semanticLinkProviders,
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
