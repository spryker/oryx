import { PageMetaResolver } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import { provideExperienceData } from '@spryker-oryx/experience';
import { SuggestionAdapter } from '@spryker-oryx/search';
import {
  ArticleIdContextFallback,
  ArticleTypeContextFallback,
} from './article-context';
import { experienceArticlePages } from './article-page';
import { ContentSuggestionAdapter } from './content-suggestion.adapter';
import { contentfulProviders } from './contentful';
import {
  ArticlePageDescriptionMetaResolver,
  ArticlePageTitleMetaResolver,
} from './resolvers';
import { storyblokProviders } from './storyblok';
import { strapiProviders } from './strapi';

export const articleProviders: Provider[] = [
  ArticleIdContextFallback,
  ArticleTypeContextFallback,
  ...contentfulProviders,
  ...storyblokProviders,
  ...strapiProviders,
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
    provide: SuggestionAdapter,
    useClass: ContentSuggestionAdapter,
  },
];
