import { appBuilder } from '@spryker-oryx/core';
import { offlineServiceWorkerFulfillmentFeatures } from '@spryker-oryx/presets';

export const app = appBuilder()
  .withEnvironment(process.env)
  .withFeature(offlineServiceWorkerFulfillmentFeatures())
  .create();
