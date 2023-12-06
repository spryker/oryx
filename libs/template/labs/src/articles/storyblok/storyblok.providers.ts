import { ContentConfig } from '@spryker-oryx/content';
import { injectEnv } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import { getClassByRequiredTokens } from '../stubs';
import { storyblokFieldNormalizers } from './normalizers';
import { DefaultStoryblokContentAdapter } from './storyblok-content.adapter';
import {
  StoryblokContentAdapter,
  StoryblokSpace,
  StoryblokToken,
} from './storyblok.model';

export const storyblokProviders: Provider[] = [
  {
    provide: StoryblokToken,
    useFactory: () => injectEnv('ORYX_STORYBLOK_TOKEN', ''),
  },
  {
    provide: StoryblokSpace,
    useFactory: () => injectEnv('ORYX_STORYBLOK_SPACE', ''),
  },
  ...storyblokFieldNormalizers,
  {
    provide: ContentConfig,
    useValue: {
      storyblok: {
        types: ['component', 'faq', 'contents'],
      },
    },
  },
  {
    provide: StoryblokContentAdapter,
    useFactory: () =>
      getClassByRequiredTokens(DefaultStoryblokContentAdapter, [
        StoryblokToken,
        StoryblokSpace,
      ]),
  },
];
