import {
  DefaultSemanticLinkService,
  DefaultSuggestionAdapter,
  DefaultSuggestionService,
  SemanticLinkService,
  SuggestionAdapter,
  SuggestionNormalizers,
  suggestionNormalizers,
  SuggestionService,
} from '.';

export const SITE_PROVIDERS = [
  {
    provide: SemanticLinkService,
    useClass: DefaultSemanticLinkService,
  },
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
