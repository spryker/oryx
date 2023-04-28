import { appBuilder, injectEnv } from '@spryker-oryx/core';
import {
  fulfillmentTheme,
  offlineFulfillmentFeatures,
} from '@spryker-oryx/presets';
import { fallbackEnv } from './fallback-env';
import { siteFeature } from '@spryker-oryx/site';
import { ContentBackendUrl, experienceFeature } from '@spryker-oryx/experience';

appBuilder()
  .withEnvironment({ ...fallbackEnv, ...(import.meta.env as AppEnvironment) })
  .withFeature(experienceFeature)
  .withFeature({
    providers: [{
      provide: ContentBackendUrl,
      useFactory: () => injectEnv('ORYX_FULFILLMENT_BACKEND_URL', ''),
    }]
  })
  .withFeature(siteFeature)
  .withTheme(fulfillmentTheme)
  .withFeature(
    offlineFulfillmentFeatures({
      picking: {
        appVersion: import.meta.env.ORYX_FULFILLMENT_APP_VERSION,
      },
    })
  )
  .create()
  .then(() => console.debug('Fulfillment App started!'))
  .catch(console.error);
