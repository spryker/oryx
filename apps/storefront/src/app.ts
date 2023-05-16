import { appBuilder } from '@spryker-oryx/application';
import { labsFeatures } from '@spryker-oryx/labs';
import { b2cFeatures } from '@spryker-oryx/presets';
import { storefrontTheme as b2cTheme } from '@spryker-oryx/themes';

const env = import.meta.env;
const features = [...b2cFeatures];

if (env.ORYX_LABS) {
  features.push(...labsFeatures);
}

export const app = appBuilder()
  .withFeature(features)
  .withTheme(b2cTheme)
  .withEnvironment(env)
  .create();
