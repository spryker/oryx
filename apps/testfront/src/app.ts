import { appBuilder } from '@spryker-oryx/application';
import { storefrontFeatures } from '@spryker-oryx/presets/storefront';
import { storefrontTheme } from '@spryker-oryx/themes';

export const app = appBuilder()
  .withFeature(storefrontFeatures)
  .withTheme(storefrontTheme)
  .withEnvironment(import.meta.env)
  .create();
