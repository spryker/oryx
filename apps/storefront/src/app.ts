import { appBuilder } from '@spryker-oryx/application';
import { labsFeatures } from '@spryker-oryx/labs';
import { storefrontFeatures } from '@spryker-oryx/presets';
import { storefrontTheme } from '@spryker-oryx/themes';

const env = import.meta.env;
const features = [...storefrontFeatures];

if (env.ORYX_LABS) {
  features.push(...labsFeatures);
}

export const app = appBuilder()
  .withFeature(features)
  .withTheme(storefrontTheme)
  .withEnvironment(env)
  .create();
