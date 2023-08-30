import { ContentAdapter, ContentConfig } from '@spryker-oryx/content';
import { injectEnv } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import { ContentfulSpace, ContentfulToken } from '@spryker-oryx/experience';
import { SuggestionAdapter } from '@spryker-oryx/search';
import { factory } from '../stubs';
import {
  ContentfulCmsAdapter,
  cmsContentfulName,
} from './contentful-content.adapter';
import { DefaultContentfulSuggestionAdapter } from './contentful-suggestion.adapter';
import { contentfulFieldNormalizers } from './normalizers';

export const contentfulProviders: Provider[] = [
  {
    provide: ContentfulToken,
    useFactory: () => injectEnv('ORYX_CONTENTFUL_TOKEN', ''),
  },
  {
    provide: ContentfulSpace,
    useFactory: () => injectEnv('ORYX_CONTENTFUL_SPACE', ''),
  },
  {
    provide: ContentAdapter,
    useFactory: () =>
      factory(ContentfulCmsAdapter, [ContentfulToken, ContentfulSpace]),
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
  {
    provide: SuggestionAdapter,
    useFactory: () =>
      factory(DefaultContentfulSuggestionAdapter, [
        ContentfulToken,
        ContentfulSpace,
      ]),
  },
];
