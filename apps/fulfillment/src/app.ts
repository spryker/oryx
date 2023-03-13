import { appBuilder } from '@spryker-oryx/core';
import {
  fulfillmentTheme,
  offlineFulfillmentFeatures,
} from '@spryker-oryx/presets';

appBuilder()
  .withEnvironment(import.meta.env)
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
