import { ContentConfig } from '@spryker-oryx/content';
import { injectEnv } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import { getClassByRequiredTokens } from '../stubs';
import { DefaultContentfulContentAdapter } from './contentful-content.adapter';
import {
  ContentfulContentAdapter,
  ContentfulSpace,
  ContentfulToken,
} from './contentful.model';
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
  ...contentfulFieldNormalizers,
  {
    provide: ContentConfig,
    useValue: {
      contentful: {
        types: ['component', 'contents', 'article'],
      },
    },
  },
  {
    provide: ContentfulContentAdapter,
    useFactory: () =>
      getClassByRequiredTokens(DefaultContentfulContentAdapter, [
        ContentfulToken,
        ContentfulSpace,
      ]),
  },
];
