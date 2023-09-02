import { ContentAdapter, ContentConfig } from '@spryker-oryx/content';
import { injectEnv } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import { SuggestionAdapter } from '@spryker-oryx/search';
import { factory } from '../stubs';
import {
  ContentfulContentAdapter,
  cmsContentfulName,
} from './contentful-content.adapter';
import { DefaultContentfulSuggestionAdapter } from './contentful-suggestion.adapter';
import { ContentfulSpace, ContentfulToken } from './contentful.model';
import { contentfulFieldNormalizers } from './normalizers';

export const contentfulArticleProviders: Provider[] = [
  {
    provide: ContentfulToken,
    useFactory: () => injectEnv('ORYX_CONTENTFUL_TOKEN', ''),
  },
  {
    provide: ContentfulSpace,
    useFactory: () => injectEnv('ORYX_CONTENTFUL_SPACE', ''),
  },

  ...contentfulFieldNormalizers,
  {
    provide: ContentConfig,
    useValue: {
      [cmsContentfulName]: {
        types: ['component', 'article'],
      },
    },
  },
];

export const contentfulProviders: Provider[] = [
  ...contentfulArticleProviders,
  {
    provide: ContentAdapter,
    useFactory: () =>
      factory(ContentfulContentAdapter, [ContentfulToken, ContentfulSpace]),
  },
  {
    provide: SuggestionAdapter,
    useFactory: () =>
      factory(DefaultContentfulSuggestionAdapter, [
        ContentfulToken,
        ContentfulSpace,
      ]),
  },
];
