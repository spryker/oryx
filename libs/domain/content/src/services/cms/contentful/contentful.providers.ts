import { injectEnv } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import { featureVersion } from '@spryker-oryx/utilities';
import { DefaultContentfulContentAdapter } from './contentful-content.adapter';
import {
  ContentfulContentAdapter,
  ContentfulSpace,
  ContentfulToken,
} from './contentful.model';
import {
  contentfulAssetsNormalizers,
  contentfulFieldNormalizers,
} from './normalizers';

export const contentfulProviders: Provider[] =
  featureVersion >= '1.4' &&
  import.meta.env?.ORYX_CONTENTFUL_TOKEN &&
  import.meta.env?.ORYX_CONTENTFUL_SPACE
    ? [
        {
          provide: ContentfulToken,
          useFactory: () => injectEnv('ORYX_CONTENTFUL_TOKEN', ''),
        },
        {
          provide: ContentfulSpace,
          useFactory: () => injectEnv('ORYX_CONTENTFUL_SPACE', ''),
        },
        ...contentfulFieldNormalizers,
        ...contentfulAssetsNormalizers,
        {
          provide: ContentfulContentAdapter,
          useClass: DefaultContentfulContentAdapter,
        },
      ]
    : [];
