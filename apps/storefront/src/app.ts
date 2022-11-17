import { app } from '@spryker-oryx/core';
import { b2cFeatures } from '@spryker-oryx/presets';
import { storefrontTheme } from '@spryker-oryx/themes';

export const appBuilder = app()
  .withFeature(b2cFeatures)
  .withTheme(storefrontTheme)
  .create();
