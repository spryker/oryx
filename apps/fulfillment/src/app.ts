import { appBuilder } from '@spryker-oryx/application';
import { offlineFulfillmentFeatures } from '@spryker-oryx/presets/fulfillment';
import { fulfillmentTheme } from '@spryker-oryx/themes';
import { ColorMode } from '@spryker-oryx/utilities';

const env = import.meta.env;

appBuilder()
  .withEnvironment(env)
  .withFeature(
    offlineFulfillmentFeatures({
      picking: { appVersion: env.ORYX_FULFILLMENT_APP_VERSION },
    })
  )
  .withOptions({
    'oryx-app': { colorMode: ColorMode.Light },
  })
  .withTheme(fulfillmentTheme)
  .create();
