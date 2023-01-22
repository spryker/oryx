import { Provider } from '@spryker-oryx/di';
import { facetProviders } from '../renderers';
import {
  DefaultSuggestionAdapter,
  SuggestionAdapter,
  suggestionNormalizer,
} from './adapter';
import { componentsProvider } from './components.provider';
import { DefaultFacetListService } from './default-facet-list.service';
import { DefaultSortingService } from './default-sorting.service';
import { FacetListService } from './facet-list.service';
import { SortingService } from './sorting.service';
import { DefaultSuggestionService, SuggestionService } from './suggestion';

export const searchProviders: Provider[] = [
  componentsProvider,
  {
    provide: SuggestionAdapter,
    useClass: DefaultSuggestionAdapter,
  },
  {
    provide: SuggestionService,
    useClass: DefaultSuggestionService,
  },
  {
    provide: FacetListService,
    useClass: DefaultFacetListService,
  },
  {
    provide: SortingService,
    useClass: DefaultSortingService,
  },
  ...facetProviders,
  ...suggestionNormalizer,
];
