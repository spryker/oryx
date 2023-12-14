import { ContentConfig } from '@spryker-oryx/content';
import { PageMetaResolver } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import { provideExperienceData } from '@spryker-oryx/experience';
import { ArticleQualifierContextFallback } from './article-context';
import { experienceArticlePages } from './article-page';
import { ContentSuggestionAdapter } from './content-suggestion.adapter';
import { contentfulProviders } from './contentful';
import { articleRoutes } from './article-routes';
import {
  ArticlePageDescriptionMetaResolver,
  ArticlePageTitleMetaResolver,
} from './resolvers';

export const articleProviders: Provider[] = [
  ArticleQualifierContextFallback,
  provideExperienceData(experienceArticlePages),
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
