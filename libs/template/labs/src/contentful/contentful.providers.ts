import { ContentAdapter } from '@spryker-oryx/content';
import { injectEnv } from '@spryker-oryx/core';
import { inject, Provider, Type } from '@spryker-oryx/di';
import { SuggestionAdapter } from '@spryker-oryx/search';
import { of } from 'rxjs';
import {
  ContentfulApiService,
  ContentfulSpace,
  ContentfulToken,
  DefaultContentfulApiService,
} from './api';
import { DefaultContentfulSuggestionAdapter } from './contentful-suggestion.adapter';
import { ContentfulAdapter } from './contentful.adapter';

let logged = 0;
const logMissingEnv = (): void => {
  if (logged > 0) return;
  console.warn(
    `Missing ORYX_CONTENTFUL_TOKEN or\\and ORYX_CONTENTFUL_SPACE environment variables`
  );
  logged++;
};
const factory = (clazz: Type<unknown>): unknown => {
  if (!inject(ContentfulSpace) || !inject(ContentfulToken)) {
    logMissingEnv();
    return { get: () => of({}) };
  }

  return new clazz();
};

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
    useFactory: () => factory(DefaultContentfulApiService),
  },
  {
    provide: ContentAdapter,
    useFactory: () => factory(ContentfulAdapter),
  },
  {
    provide: SuggestionAdapter,
    useFactory: () => factory(DefaultContentfulSuggestionAdapter),
  },
];
