import {
  ContentAdapter,
  ContentConfig,
  ContentFields,
} from '@spryker-oryx/content';
import { injectEnv } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import { SuggestionField } from '@spryker-oryx/search';
import { getClassByRequiredTokens } from '../stubs';
import {
  ContentfulContentAdapter,
  cmsContentfulName,
} from './contentful-content.adapter';
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
        types: [
          ContentFields.Component,
          SuggestionField.Contents,
          ContentFields.Article,
        ],
      },
    },
  },
];

export const contentfulProviders: Provider[] = [
  ...contentfulArticleProviders,
  {
    provide: ContentAdapter,
    useFactory: () =>
      getClassByRequiredTokens(ContentfulContentAdapter, [
        ContentfulToken,
        ContentfulSpace,
      ]),
  },
];
