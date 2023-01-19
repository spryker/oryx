import { appBuilder } from '@spryker-oryx/core';
import { b2cFeatures, b2cTheme } from '@spryker-oryx/presets';

export const app = appBuilder()
  .withFeature(b2cFeatures)
  .withTheme(b2cTheme)
  .withEnvironment(import.meta.env)
  .withFeatureFlags({
    'content-link': {
      text: 'this-is link',
    },
  })
  .create();
