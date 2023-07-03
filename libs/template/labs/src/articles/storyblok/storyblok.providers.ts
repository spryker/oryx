import { ContentAdapter } from '@spryker-oryx/content';
import { injectEnv } from '@spryker-oryx/core';
import { inject, Provider, Type } from '@spryker-oryx/di';
import { SuggestionAdapter } from '@spryker-oryx/search';
import { of } from 'rxjs';
import {
  DefaultStoryblokApiService,
  StoryblokApiService,
  StoryblokToken,
} from './api';
import { DefaultStoryblokSuggestionAdapter } from './storyblok-suggestion.adapter';
import { StoryblokAdapter } from './storyblok.adapter';

let logged = 0;
const logMissingEnv = (): void => {
  if (logged > 0) return;
  console.warn(
    `Missing ORYX_CONTENTFUL_TOKEN or\\and ORYX_CONTENTFUL_SPACE environment variables`
  );
  logged++;
};
const factory = (clazz: Type<unknown>): unknown => {
  if (!inject(StoryblokToken)) {
    logMissingEnv();
    return { get: () => of({}) };
  }

  return new clazz();
};

export const storyblokProviders: Provider[] = [
  {
    provide: StoryblokToken,
    useFactory: () => injectEnv('ORYX_CONTENTFUL_TOKEN', ''),
  },
  {
    provide: StoryblokApiService,
    useFactory: () => factory(DefaultStoryblokApiService),
  },
  {
    provide: ContentAdapter,
    useFactory: () => factory(StoryblokAdapter),
  },
  {
    provide: SuggestionAdapter,
    useFactory: () => factory(DefaultStoryblokSuggestionAdapter),
  },
];
