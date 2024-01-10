import { appBuilder } from '@spryker-oryx/application';
import { multiCartFeature } from '@spryker-oryx/cart';
import { labsFeatures } from '@spryker-oryx/labs';
// import { merchantFeature } from '@spryker-oryx/merchant';
import { b2bStorefrontFeatures } from '@spryker-oryx/presets/b2b-storefront';
import { storefrontFeatures } from '@spryker-oryx/presets/storefront';
import { storefrontTheme } from '@spryker-oryx/themes';

const env = import.meta.env;

const features = [
  ...(env.ORYX_PRESET && env.ORYX_PRESET === 'b2b'
    ? b2bStorefrontFeatures
    : [
        ...storefrontFeatures,
        ...(env.ORYX_MULTI_CART ? [multiCartFeature] : []),
      ]),
  // ...(env.ORYX_MERCHANT ? [merchantFeature] : []),
  ...(env.ORYX_LABS ? labsFeatures : []),
];

export const app = appBuilder()
  .withFeature(features)
  .withTheme([storefrontTheme])
  .withEnvironment(env)
  .create();
