import { ContentAdapter, ContentConfig } from '@spryker-oryx/content';
import { injectEnv } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import { factory } from '../stubs';
import { storyblokFieldNormalizers } from './normalizers';
import {
  StoryblokContentAdapter,
  cmsStoryblokName,
} from './storyblok-content.adapter';
import { StoryblokSpace, StoryblokToken } from './storyblok.model';

export const storyblokProviders: Provider[] = [
  {
    provide: StoryblokToken,
    useFactory: () => injectEnv('ORYX_STORYBLOK_TOKEN', ''),
  },
  {
    provide: StoryblokSpace,
    useFactory: () => injectEnv('ORYX_STORYBLOK_SPACE', ''),
  },
  {
    provide: ContentAdapter,
    useFactory: () => factory(StoryblokContentAdapter, [StoryblokToken]),
  },
  {
    provide: ContentConfig,
    useValue: {
      [cmsStoryblokName]: {
        types: ['faq'],
      },
    },
  },
  ...storyblokFieldNormalizers,
];
