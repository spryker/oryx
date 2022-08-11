import {
  DefaultSuggestionAdapter,
  DefaultSuggestionService,
  SuggestionAdapter,
  SuggestionNormalizers,
  suggestionNormalizers,
  SuggestionService,
} from '.';

export const SEARCH_SUGGESTION_PROVIDERS = [
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

export const SEARCH_PROVIDERS = [...SEARCH_SUGGESTION_PROVIDERS];
