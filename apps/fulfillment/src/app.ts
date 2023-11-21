import { appBuilder } from '@spryker-oryx/application';
import { labsFeatures } from '@spryker-oryx/labs';
import { fulfillmentFeatures } from '@spryker-oryx/presets/fulfillment';
import { fulfillmentTheme } from '@spryker-oryx/themes';
import { ColorMode } from '@spryker-oryx/utilities';

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
  .withOptions({
    'oryx-app': { colorMode: ColorMode.Light },
  })
  .withTheme(fulfillmentTheme)
  .create();
