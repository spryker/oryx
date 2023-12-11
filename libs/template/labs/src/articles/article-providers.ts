import { PageMetaResolver } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import { provideExperienceData } from '@spryker-oryx/experience';
import { provideLitRoutes } from '@spryker-oryx/router/lit';
import { SuggestionAdapter } from '@spryker-oryx/search';
import {
  ArticleIdContextFallback,
  ArticleTypeContextFallback,
} from './article-context';
import { experienceArticlePages } from './article-page';
import { articleRoutes } from './article-routes';
import { ContentSuggestionAdapter } from './content-suggestion.adapter';
import { contentfulProviders } from './contentful';
import {
  ArticlePageDescriptionMetaResolver,
  ArticlePageTitleMetaResolver,
} from './resolvers';

export const articleProviders: Provider[] = [
  ArticleIdContextFallback,
  ArticleTypeContextFallback,
  ...contentfulProviders,
  // ...storyblokProviders,
  // ...strapiProviders,
  provideExperienceData(experienceArticlePages),
  ...provideLitRoutes({ routes: articleRoutes }),
  {
    provide: PageMetaResolver,
    useClass: ArticlePageTitleMetaResolver,
  },
  {
    provide: PageMetaResolver,
    useClass: ArticlePageDescriptionMetaResolver,
  },
  {
    provide: SuggestionAdapter,
    useClass: ContentSuggestionAdapter,
  },
];
