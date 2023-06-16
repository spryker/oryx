import { appBuilder } from '@spryker-oryx/application';
import { labsFeatures } from '@spryker-oryx/labs';
import { storefrontFeatures } from '@spryker-oryx/presets/storefront';
import { storefrontTheme } from '@spryker-oryx/themes';
import { HeadingTag } from '@spryker-oryx/ui/heading';

const env = import.meta.env;

const features = [
  ...storefrontFeatures,
  ...(env.ORYX_LABS ? labsFeatures : []),
];

export const app = appBuilder()
  .withFeature(features)
  .withTheme([storefrontTheme])
  .withOptions({
    'oryx-product-title': {
      tag: HeadingTag.H3,
    },
  })
  .withEnvironment(env)
  .create();
