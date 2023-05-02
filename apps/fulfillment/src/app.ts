import { appBuilder } from '@spryker-oryx/application';
import { injectEnv } from '@spryker-oryx/core';
import { ContentBackendUrl, experienceFeature } from '@spryker-oryx/experience';
import {
  fulfillmentTheme,
  offlineFulfillmentFeatures,
} from '@spryker-oryx/presets';
import { siteFeature } from '@spryker-oryx/site';
import { fallbackEnv } from './fallback-env';

appBuilder()
  .withEnvironment({ ...fallbackEnv, ...(import.meta.env as AppEnvironment) })
  .withFeature(experienceFeature)
  .withFeature({
    providers: [
      {
        provide: ContentBackendUrl,
        useFactory: () => injectEnv('ORYX_FULFILLMENT_BACKEND_URL', ''),
      },
    ],
  })
  .withFeature(siteFeature)
  .withFeature(
    offlineFulfillmentFeatures({
      picking: {
        appVersion: import.meta.env.ORYX_FULFILLMENT_APP_VERSION,
      },
    })
  )
  .withTheme(fulfillmentTheme)
  .create()
  .then(() => console.debug('Fulfillment App started!'))
  .catch(console.error);
