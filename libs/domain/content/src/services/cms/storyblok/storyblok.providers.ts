import { injectEnv } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import { featureVersion } from '@spryker-oryx/utilities';
import { storyblokFieldNormalizers } from './normalizers';
import { DefaultStoryblokContentAdapter } from './storyblok-content.adapter';
import {
  StoryblokContentAdapter,
  StoryblokSpace,
  StoryblokToken,
} from './storyblok.model';

export const storyblokProviders: Provider[] =
  featureVersion >= '1.4' &&
  import.meta.env?.ORYX_STORYBLOK_TOKEN &&
  import.meta.env?.ORYX_STORYBLOK_SPACE
    ? [
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
          provide: StoryblokContentAdapter,
          useClass: DefaultStoryblokContentAdapter,
        },
      ]
    : [];
