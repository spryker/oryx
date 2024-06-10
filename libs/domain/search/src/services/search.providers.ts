import { PageMetaResolver } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import { ExperienceDataRevealer } from '@spryker-oryx/experience';
import { provideLitRoutes } from '@spryker-oryx/router/lit';
import { featureVersion } from '@spryker-oryx/utilities';
import { facetProviders } from '../renderers';
import { MockSuggestionAdapter } from './adapter';
import {
  ContentSuggestionAdapter,
  GlueSuggestionAdapter,
  SuggestionAdapter,
  SuggestionField,
  suggestionNormalizer,
} from './adapter/spryker-glue';
import { DefaultFacetListService } from './default-facet-list.service';
import { DefaultSortingService } from './default-sorting.service';
import { FacetListService } from './facet-list.service';
import {
  CategoryBreadcrumb,
  CategoryPageTitleMetaResolver,
  SearchPageTitleMetaResolver,
} from './resolvers';
import {
  ProductsExperienceDataRevealer,
  SuggestionExperienceDataRevealer,
} from './revealers';
import { categoryRoutes } from './routes';
import { SortingService } from './sorting.service';
import {
  DefaultSuggestionRendererService,
  DefaultSuggestionService,
  SuggestionRenderer,
  SuggestionRendererService,
  SuggestionService,
  defaultSuggestionRenderer,
  productSuggestionRenderer,
} from './suggestion';

export const glueSearchConnectors: Provider[] = [
  {
    provide: SuggestionAdapter,
    useClass: GlueSuggestionAdapter,
  },
];

export const mockSearchConnectors: Provider[] = [
  {
    provide: SuggestionAdapter,
    useClass: MockSuggestionAdapter,
  },
];

export const searchProviders: Provider[] = [
  featureVersion >= '1.4'
    ? {
        provide: SuggestionAdapter,
        useClass: ContentSuggestionAdapter,
      }
    : ({} as Provider),
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
  CategoryBreadcrumb,
  ...(featureVersion >= '1.4'
    ? []
    : provideLitRoutes({ routes: categoryRoutes })),
];

export const glueSearchProviders: Provider[] = [
  ...glueSearchConnectors,
  ...searchProviders,
];

export const mockSearchProviders: Provider[] = [
  ...mockSearchConnectors,
  ...searchProviders,
];

export const searchPreviewProviders: Provider[] = [
  {
    provide: ExperienceDataRevealer,
    useClass: ProductsExperienceDataRevealer,
  },
  {
    provide: ExperienceDataRevealer,
    useClass: SuggestionExperienceDataRevealer,
  },
];
