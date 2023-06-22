import { ContentAdapter } from '@spryker-oryx/content';
import { injectEnv } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import { SuggestionRenderer } from '@spryker-oryx/search';
import {
  ContentfulClientService,
  ContentfulSpace,
  ContentfulToken,
  DefaultContentfulClientService,
} from './client';
import { ContentfulAdapter } from './contentful.adapter';
import {
  ContentfulSuggestionAdapter,
  ContentfulSuggestionRenderer,
  ContentfulSuggestionService,
  DefaultContentfulSuggestionAdapter,
  DefaultContentfulSuggestionService,
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
    provide: ContentfulSuggestionAdapter,
    useClass: DefaultContentfulSuggestionAdapter,
  },
  {
    provide: ContentfulSuggestionService,
    useClass: DefaultContentfulSuggestionService,
  },
  {
    provide: SuggestionRenderer,
    useClass: ContentfulSuggestionRenderer,
  },
];
