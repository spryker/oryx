import { injectEnv } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import { strapiFieldNormalizers } from './normalizers';
import { DefaultStrapiContentAdapter } from './strapi-content.adapter';
import {
  StrapiApiUrl,
  StrapiContentAdapter,
  StrapiToken,
} from './strapi.model';

export const strapiProviders: Provider[] =
  import.meta.env?.ORYX_STRAPI_TOKEN && import.meta.env?.ORYX_STRAPI_API_URL
    ? [
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
          provide: StrapiContentAdapter,
          useClass: DefaultStrapiContentAdapter,
        },
      ]
    : [];
