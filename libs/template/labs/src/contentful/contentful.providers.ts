import { ContentAdapter, ContentFields } from '@spryker-oryx/content';
import { FeatureOptions, injectEnv } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import {
  SuggestionAdapter,
  SuggestionField,
  SuggestionRevealer,
} from '@spryker-oryx/search';
import {
  ContentfulClientService,
  ContentfulSpace,
  ContentfulToken,
  DefaultContentfulClientService,
} from './client';
import { ContentfulAdapter } from './contentful.adapter';
import {
  ContentfulSuggestionRevealer,
  DefaultContentfulSuggestionAdapter,
} from './suggestion';

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
    provide: ContentfulClientService,
    useClass: DefaultContentfulClientService,
  },
  {
    provide: ContentAdapter,
    useClass: ContentfulAdapter,
  },
  {
    provide: SuggestionAdapter,
    useClass: DefaultContentfulSuggestionAdapter,
  },
  {
    provide: FeatureOptions,
    useValue: {
      'oryx-search-box': {
        entries: [...Object.values(SuggestionField), 'contentful'],
      },
      'oryx-content-article': {
        entries: [...Object.values(ContentFields), 'contentful'],
      },
    },
  },
  {
    provide: SuggestionRevealer,
    useClass: ContentfulSuggestionRevealer,
  },
];
