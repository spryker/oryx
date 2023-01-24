import { Provider } from '@spryker-oryx/di';
import { ProductListPageService } from '@spryker-oryx/product';
import {
  DefaultFacetListService,
  DefaultSuggestionAdapter,
  FacetListService,
  SuggestionAdapter,
  SuggestionService,
} from '@spryker-oryx/search';
import { FacetColorsMapping } from '@spryker-oryx/search/facet-color';
import { SortingService } from '../../services/sorting.service';
import { mockFacetColors } from './mock-facet-colors';
import { MockProductListPageService } from './mock-pagiation.service';
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
    provide: ProductListPageService,
    useClass: MockProductListPageService,
  },
];
