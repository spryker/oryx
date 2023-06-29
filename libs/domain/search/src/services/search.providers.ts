import { PageMetaResolver } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import { ExperienceDataRevealer } from '@spryker-oryx/experience';
import { facetProviders } from '../renderers';
import {
  DefaultSuggestionAdapter,
  SuggestionAdapter,
  SuggestionField,
  suggestionNormalizer,
} from './adapter';
import { DefaultFacetListService } from './default-facet-list.service';
import { DefaultSortingService } from './default-sorting.service';
import { FacetListService } from './facet-list.service';
import {
  CategoryPageTitleMetaResolver,
  SearchPageTitleMetaResolver,
} from './resolvers';
import { ProductsExperienceDataRevealer } from './revealers';
import { SortingService } from './sorting.service';
import {
  defaultSuggestionRenderer,
  DefaultSuggestionRendererService,
  DefaultSuggestionService,
  productSuggestionRenderer,
  SuggestionRenderer,
  SuggestionRendererService,
  SuggestionService,
} from './suggestion';

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

export const searchPreviewProviders: Provider[] = [
  {
    provide: ExperienceDataRevealer,
    useClass: ProductsExperienceDataRevealer,
  },
];
