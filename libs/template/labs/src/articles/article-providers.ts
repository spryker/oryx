import { Provider } from '@spryker-oryx/di';
import { SuggestionAdapter } from '@spryker-oryx/search';
import { ContentSuggestionAdapter } from './content-suggestion.adapter';
import { contentfulProviders } from './contentful';
import { storyblokProviders } from './storyblok';
import { strapiProviders } from './strapi';

export const articleProviders: Provider[] = [
  // ArticleIdContextFallback,
  // ArticleTypeContextFallback,
  ...contentfulProviders,
  ...storyblokProviders,
  ...strapiProviders,
  // provideExperienceData(experienceArticlePages),
  // ...provideLitRoutes({ routes: articleRoutes }),
  // {
  //   provide: PageMetaResolver,
  //   useClass: ArticlePageTitleMetaResolver,
  // },
  // {
  //   provide: PageMetaResolver,
  //   useClass: ArticlePageDescriptionMetaResolver,
  // },
  {
    provide: SuggestionAdapter,
    useClass: ContentSuggestionAdapter,
  },
];
