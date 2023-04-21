import { appBuilder } from '@spryker-oryx/core';
import { labsFeature } from '@spryker-oryx/labs';
import { b2cFeatures, b2cTheme } from '@spryker-oryx/presets';

const env = import.meta.env;
const features = [...b2cFeatures];

if (env.ORYX_LABS) {
  features.push(...labsFeature);
}

export const app = appBuilder()
  .withFeature(features)
  .withTheme(b2cTheme)
  .withEnvironment(env)
  .create();
