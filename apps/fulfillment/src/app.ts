import { appBuilder } from '@spryker-oryx/application';
import { labsFeatures } from '@spryker-oryx/labs';
import { offlineFulfillmentFeatures } from '@spryker-oryx/presets/fulfillment';
import { fulfillmentTheme } from '@spryker-oryx/themes';

const env = import.meta.env;

appBuilder()
  .withEnvironment(env)
  .withFeature(
    offlineFulfillmentFeatures({
      picking: {
        appVersion: env.ORYX_FULFILLMENT_APP_VERSION,
      },
    })
  )
  .withFeature([...(env.ORYX_LABS ? labsFeatures : [])])
  .withTheme(fulfillmentTheme)
  .create()
  .then(() => console.debug('Fulfillment App started!'))
  .catch(console.error);
