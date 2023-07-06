import { ContentAdapter } from '@spryker-oryx/content';
import { injectEnv } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import { SuggestionAdapter } from '@spryker-oryx/search';
import { factory } from '../stubs';
import {
  DefaultStoryblokClientService,
  StoryblokClientService,
  StoryblokToken,
} from './client';
import { DefaultStoryblokSuggestionAdapter } from './storyblok-suggestion.adapter';
import { StoryblokAdapter } from './storyblok.adapter';

export const storyblokProviders: Provider[] = [
  {
    provide: StoryblokToken,
    useFactory: () => injectEnv('ORYX_STORYBLOK_TOKEN', ''),
  },
  {
    provide: StoryblokClientService,
    useFactory: () => factory(DefaultStoryblokClientService, [StoryblokToken]),
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
