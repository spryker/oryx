import {
  ContentAdapter,
  ContentConfig,
  ContentFields,
} from '@spryker-oryx/content';
import { injectEnv } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import { SuggestionField } from '@spryker-oryx/search';
import { getClassByRequiredTokens } from '../stubs';
import { storyblokFieldNormalizers } from './normalizers';
import {
  StoryblokContentAdapter,
  cmsStoryblokName,
} from './storyblok-content.adapter';
import { StoryblokSpace, StoryblokToken } from './storyblok.model';

export const storyblokArticleProviders: Provider[] = [
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
      [cmsStoryblokName]: {
        types: [ContentFields.Faq, SuggestionField.Contents],
      },
    },
  },
];

export const storyblokProviders: Provider[] = [
  ...storyblokArticleProviders,
  {
    provide: ContentAdapter,
    useFactory: () =>
      getClassByRequiredTokens(StoryblokContentAdapter, [
        StoryblokToken,
        StoryblokSpace,
      ]),
  },
];
