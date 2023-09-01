import { appBuilder } from '@spryker-oryx/application';
import { injectEnv } from '@spryker-oryx/core';
import { labsFeatures } from '@spryker-oryx/labs';
import { b2bStorefrontFeatures } from '@spryker-oryx/presets/b2b-storefront';
import { storefrontFeatures } from '@spryker-oryx/presets/storefront';
import { PriceMode } from '@spryker-oryx/site';
import { storefrontTheme } from '@spryker-oryx/themes';

const env = import.meta.env;

const features = [
  ...(env.ORYX_PRESET && env.ORYX_PRESET === 'b2b'
    ? b2bStorefrontFeatures
    : storefrontFeatures),
  ...(env.ORYX_LABS ? labsFeatures : []),
];

export const app = appBuilder()
  .withFeature(features)
  .withFeature({
    providers: [
      {
        provide: PriceMode,
        useFactory: () => injectEnv('PRICE_MODE'),
      },
    ],
  })
  .withTheme([storefrontTheme])
  .withEnvironment(env)
  .create();
