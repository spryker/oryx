import { SuggestionService } from '../../services';
import { MockSuggestionService } from './mock-suggestion.service';

export const MOCK_SUGGESTION_PROVIDERS = [
  {
    provide: SuggestionService,
    useClass: MockSuggestionService,
  },
];
