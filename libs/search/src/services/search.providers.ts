import {
  DefaultSuggestionAdapter,
  DefaultSuggestionService,
  SuggestionAdapter,
  SuggestionNormalizers,
  suggestionNormalizers,
  SuggestionService,
} from '.';

export const searchSuggestionProviders = [
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
