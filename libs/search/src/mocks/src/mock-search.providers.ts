import { Provider } from '@spryker-oryx/injector';
import { SuggestionService } from '../../services';
import { MockSuggestionService } from './suggestion/mock-suggestion.service';

export const mockSearchProviders: Provider[] = [
  {
    provide: SuggestionService,
    useClass: MockSuggestionService,
  },
];
