import { appBuilder } from '@spryker-oryx/core';
import {
  fulfillmentTheme,
  offlineFulfillmentFeatures,
} from '@spryker-oryx/presets';
import { fallbackEnv } from './fallback-env';

appBuilder()
  .withEnvironment({ ...fallbackEnv, ...(import.meta.env as AppEnvironment) })
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
