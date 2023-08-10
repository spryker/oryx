import { appBuilder } from '@spryker-oryx/application';
import { labsFeatures } from '@spryker-oryx/labs';
import { storefrontFeatures } from '@spryker-oryx/presets/storefront';
import { b2bStorefrontFeatures } from '@spryker-oryx/presets/b2b-storefront';
import { storefrontTheme } from '@spryker-oryx/themes';

const env = import.meta.env;

const features = [
  ...(env.ORYX_PRESET) ? b2bStorefrontFeatures : storefrontFeatures,
  ...(env.ORYX_LABS ? labsFeatures : []),
];

export const app = appBuilder()
  .withFeature(features)
  .withTheme([storefrontTheme])
  .withEnvironment(env)
  .create();
