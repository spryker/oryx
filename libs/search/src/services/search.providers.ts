import { Provider } from '@spryker-oryx/injector';
import {
  DefaultSuggestionAdapter,
  SuggestionAdapter,
  SuggestionNormalizers,
  suggestionNormalizers,
} from './adapter';
import { DefaultSuggestionService, SuggestionService } from './suggestion';

export const searchSuggestionProviders: Provider[] = [
  {
    provide: SuggestionAdapter,
    useClass: DefaultSuggestionAdapter,
  },
  {
    provide: SuggestionService,
    useClass: DefaultSuggestionService,
  },
  {
    provide: SuggestionNormalizers,
    useValue: suggestionNormalizers,
  },
];

export const searchProviders = [...searchSuggestionProviders];
