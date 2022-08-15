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

export const SEMANTIC_LINK_PROVIDERS = [
  {
    provide: SemanticLinkService,
    useClass: DefaultSemanticLinkService,
  },
];

export const SITE_PROVIDERS = [
  ...SEMANTIC_LINK_PROVIDERS,
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
