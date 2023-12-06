import { appBuilder } from '@spryker-oryx/application';
import { labsFeatures } from '@spryker-oryx/labs';
import { fulfillmentFeatures } from '@spryker-oryx/presets/fulfillment';
import { fulfillmentTheme } from '@spryker-oryx/themes';

const env = import.meta.env;

const features = [
  ...fulfillmentFeatures({
    picking: {
      appVersion: env.ORYX_APP_VERSION,
    },
  }),
  ...(env.ORYX_LABS ? labsFeatures : []),
];

appBuilder()
  .withEnvironment(env)
  .withFeature(features)
  .withTheme(fulfillmentTheme)
  .create();
