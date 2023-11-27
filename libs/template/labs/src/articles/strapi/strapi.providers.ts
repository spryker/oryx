import { ContentConfig } from '@spryker-oryx/content';
import { injectEnv } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import { getClassByRequiredTokens } from '../stubs';
import { strapiFieldNormalizers } from './normalizers';
import { DefaultStrapiContentAdapter } from './strapi-content.adapter';
import {
  StrapiApiUrl,
  StrapiContentAdapter,
  StrapiToken,
} from './strapi.model';

export const strapiProviders: Provider[] = [
  {
    provide: StrapiToken,
    useFactory: () => injectEnv('ORYX_STRAPI_TOKEN', ''),
  },
  {
    provide: StrapiApiUrl,
    useFactory: () => injectEnv('ORYX_STRAPI_API_URL', ''),
  },
  ...strapiFieldNormalizers,
  {
    provide: ContentConfig,
    useValue: {
      strapi: {
        types: ['component', 'about', 'contents'],
      },
    },
  },
  {
    provide: StrapiContentAdapter,
    useFactory: () =>
      getClassByRequiredTokens(DefaultStrapiContentAdapter, [
        StrapiToken,
        StrapiApiUrl,
      ]),
  },
];
