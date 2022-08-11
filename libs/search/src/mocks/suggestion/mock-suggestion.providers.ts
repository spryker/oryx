import {
  CurrencyService,
  DefaultCurrencyService,
  DefaultLocaleService,
  LocaleService,
} from '@spryker-oryx/site';
import { SuggestionService } from '../../services';
import { MockSuggestionService } from './mock-suggestion.service';

export const MOCK_SUGGESTION_PROVIDERS = [
  {
    provide: SuggestionService,
    useClass: MockSuggestionService,
  },
  {
    provide: CurrencyService,
    useClass: DefaultCurrencyService,
  },
  {
    provide: LocaleService,
    useClass: DefaultLocaleService,
  },
];
