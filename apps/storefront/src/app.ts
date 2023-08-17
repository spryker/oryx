import { appBuilder } from '@spryker-oryx/application';
import { labsFeatures } from '@spryker-oryx/labs';
import { storefrontFeaturesFactory } from '@spryker-oryx/presets/storefront';
import { storefrontTheme } from '@spryker-oryx/themes';

const env = import.meta.env;

const features = [
  ...storefrontFeaturesFactory('latest'),
  ...(env.ORYX_LABS ? labsFeatures : []),
];

export const app = appBuilder()
  .withFeature(features)
  .withTheme([storefrontTheme])
  .withEnvironment(env)
  .create();
