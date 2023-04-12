import { appBuilder } from '@spryker-oryx/core';
import { b2cFeatures } from '@spryker-oryx/presets';
import { storefrontTheme } from '@spryker-oryx/themes';

export const app = appBuilder()
  .withEnvironment(import.meta.env)
  .withFeature(b2cFeatures)
  .withTheme(storefrontTheme)
  .create();
