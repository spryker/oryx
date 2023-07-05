import { PageMetaResolver } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import { provideExperienceData } from '@spryker-oryx/experience';
import { provideLitRoutes } from '@spryker-oryx/router/lit';
import {
  ArticleIdContextFallback,
  ArticleTypeContextFallback,
} from './article-context';
import * as articles from './article-page';
import { articleRoutes } from './article-routes';
import { contentfulProviders } from './contentful';
import {
  ArticlePageDescriptionMetaResolver,
  ArticlePageTitleMetaResolver,
} from './resolvers';
import { storyblokProviders } from './storyblok';

export const articleProviders: Provider[] = [
  ArticleIdContextFallback,
  ArticleTypeContextFallback,
  ...contentfulProviders,
  ...storyblokProviders,
  provideExperienceData(Object.values(articles)),
  ...provideLitRoutes({ routes: articleRoutes }),
  {
    provide: PageMetaResolver,
    useClass: ArticlePageTitleMetaResolver,
  },
  {
    provide: PageMetaResolver,
    useClass: ArticlePageDescriptionMetaResolver,
  },
];
