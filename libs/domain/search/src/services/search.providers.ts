import { PageMetaResolver } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import { facetProviders } from '../renderers';
import {
  DefaultSuggestionAdapter,
  SuggestionAdapter,
  suggestionNormalizer,
} from './adapter';
import { DefaultFacetListService } from './default-facet-list.service';
import { DefaultSortingService } from './default-sorting.service';
import { FacetListService } from './facet-list.service';
import {
  CategoryPageTitleMetaResolver,
  SearchPageTitleMetaResolver,
} from './resolvers';
import { SortingService } from './sorting.service';
import { DefaultSuggestionService, SuggestionService } from './suggestion';

export const searchProviders: Provider[] = [
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
  {
    provide: PageMetaResolver,
    useClass: CategoryPageTitleMetaResolver,
  },
  {
    provide: PageMetaResolver,
    useClass: SearchPageTitleMetaResolver,
  },
];
