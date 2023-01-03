import { Provider } from '@spryker-oryx/injector';
import {
  DefaultFacetListService,
  DefaultSuggestionAdapter,
  FacetListService,
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
  {
    provide: FacetListService,
    useClass: DefaultFacetListService,
  },
];
