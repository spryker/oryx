import { Provider } from '@spryker-oryx/injector';
import {
  DefaultSuggestionAdapter,
  SuggestionAdapter,
  SuggestionService,
} from '@spryker-oryx/search';
import { MockSuggestionService } from './suggestion/mock-suggestion.service';

export const mockSearchProviders: Provider[] = [
  {
    provide: SuggestionAdapter,
    useClass: DefaultSuggestionAdapter,
  },
  {
    provide: SuggestionService,
    useClass: MockSuggestionService,
  },
];
