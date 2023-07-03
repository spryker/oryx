import { ContentAdapter } from '@spryker-oryx/content';
import { injectEnv } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import { SuggestionAdapter } from '@spryker-oryx/search';
import { factory } from '../stubs';
import {
  ContentfulApiService,
  ContentfulSpace,
  ContentfulToken,
  DefaultContentfulApiService,
} from './api';
import { DefaultContentfulSuggestionAdapter } from './contentful-suggestion.adapter';
import { ContentfulAdapter } from './contentful.adapter';

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
    provide: ContentfulApiService,
    useFactory: () =>
      factory(DefaultContentfulApiService, [ContentfulSpace, ContentfulToken]),
  },
  {
    provide: ContentAdapter,
    useFactory: () =>
      factory(ContentfulAdapter, [ContentfulSpace, ContentfulToken]),
  },
  {
    provide: SuggestionAdapter,
    useFactory: () =>
      factory(DefaultContentfulSuggestionAdapter, [
        ContentfulSpace,
        ContentfulToken,
      ]),
  },
];
