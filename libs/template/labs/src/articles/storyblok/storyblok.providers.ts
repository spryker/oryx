import { ContentAdapter } from '@spryker-oryx/content';
import { injectEnv } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import { SuggestionAdapter } from '@spryker-oryx/search';
import { factory } from '../stubs';
import {
  DefaultStoryblokApiService,
  StoryblokApiService,
  StoryblokToken,
} from './api';
import { DefaultStoryblokSuggestionAdapter } from './storyblok-suggestion.adapter';
import { StoryblokAdapter } from './storyblok.adapter';

export const storyblokProviders: Provider[] = [
  {
    provide: StoryblokToken,
    useFactory: () => injectEnv('ORYX_STORYBLOK_TOKEN', ''),
  },
  {
    provide: StoryblokApiService,
    useFactory: () => factory(DefaultStoryblokApiService, [StoryblokToken]),
  },
  {
    provide: ContentAdapter,
    useFactory: () => factory(StoryblokAdapter, [StoryblokToken]),
  },
  {
    provide: SuggestionAdapter,
    useFactory: () =>
      factory(DefaultStoryblokSuggestionAdapter, [StoryblokToken]),
  },
];
