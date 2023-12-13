import { ContentConfig } from '@spryker-oryx/content';
import { PageMetaResolver } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import { provideExperienceData } from '@spryker-oryx/experience';
import { provideLitRoutes } from '@spryker-oryx/router/lit';
import {
  ArticleIdContextFallback,
  ArticleTypeContextFallback,
} from './article-context';
import { experienceArticlePages } from './article-page';
import { articleRoutes } from './article-routes';
import {
  ArticlePageDescriptionMetaResolver,
  ArticlePageTitleMetaResolver,
} from './resolvers';

export const articleProviders: Provider[] = [
  ArticleIdContextFallback,
  ArticleTypeContextFallback,
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
    provide: ContentConfig,
    useValue: {
      storyblok: {
        types: ['component', 'faq', 'contents'],
      },
      strapi: {
        types: ['component', 'about', 'contents'],
        defaultType: 'about',
      },
      contentful: {
        types: ['component', 'article', 'contents'],
      },
    },
  },
];
