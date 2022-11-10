import { Provider } from '@spryker-oryx/injector';
import {
  DefaultSuggestionAdapter,
  SuggestionAdapter,
  suggestionNormalizer,
} from './adapter';
import { DefaultSuggestionService, SuggestionService } from './suggestion';

export const searchProviders: Provider[] = [
  {
    provide: SuggestionAdapter,
    useClass: DefaultSuggestionAdapter,
  },
  {
    provide: SuggestionService,
    useClass: DefaultSuggestionService,
  },
  ...suggestionNormalizer,
];
