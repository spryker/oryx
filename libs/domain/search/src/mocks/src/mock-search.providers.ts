import { Provider } from '@spryker-oryx/di';
import {
  DefaultFacetListService,
  DefaultSuggestionAdapter,
  defaultSuggestionRenderer,
  DefaultSuggestionRendererService,
  FacetColorsMapping,
  FacetListService,
  productSuggestionRenderer,
  SuggestionAdapter,
  SuggestionField,
  SuggestionRenderer,
  SuggestionRendererService,
  SuggestionService,
} from '@spryker-oryx/search';
import { SortingService } from '../../services/sorting.service';
import { mockFacetColors } from './mock-facet-colors';
import { MockSortingService } from './sort/mock-sorting.service';
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
    provide: SortingService,
    useClass: MockSortingService,
  },
  {
    provide: FacetListService,
    useClass: DefaultFacetListService,
  },
  {
    provide: FacetColorsMapping,
    useValue: mockFacetColors,
  },
  {
    provide: SuggestionRendererService,
    useClass: DefaultSuggestionRendererService,
  },
  {
    provide: SuggestionRenderer,
    useValue: {
      default: defaultSuggestionRenderer,
      [SuggestionField.Products]: productSuggestionRenderer,
    },
  },
];
