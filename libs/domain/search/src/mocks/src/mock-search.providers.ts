import { Provider } from '@spryker-oryx/di';
import {
  DefaultFacetListService,
  DefaultSuggestionAdapter,
  FacetListService,
  SuggestionAdapter,
  SuggestionService,
} from '@spryker-oryx/search';
import { FacetColorsMapping } from '@spryker-oryx/search/facet-color';
import { mockFacetColors } from './mock-facet-colors';
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
  {
    provide: FacetColorsMapping,
    useValue: mockFacetColors,
  },
];
