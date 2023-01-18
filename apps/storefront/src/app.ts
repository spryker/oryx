import { appBuilder, FeatureFlags } from '@spryker-oryx/core';
import { b2cFeatures, b2cTheme } from '@spryker-oryx/presets';

export const app = appBuilder()
  .withFeature(b2cFeatures)
  .withTheme(b2cTheme)
  .withEnvironment(import.meta.env)
  .withProviders([
    {
      provide: FeatureFlags,
      useValue: {
        global: {
          test2: 'global',
        },
        'content-link': {
          test: 'content-link specific',
        },
      },
    },
  ])
  .create();
