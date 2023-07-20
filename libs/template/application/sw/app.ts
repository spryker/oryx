import { appBuilder } from '@spryker-oryx/application';
import {
  offlineServiceWorkerFulfillmentFeatures,
  fallbackEnv,
} from '@spryker-oryx/presets/fulfillment';

export const app = appBuilder()
  .withEnvironment({ ...fallbackEnv, ...process.env })
  .withFeature(offlineServiceWorkerFulfillmentFeatures())
  .create();
