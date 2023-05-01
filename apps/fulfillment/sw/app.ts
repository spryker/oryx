import { appBuilder } from '@spryker-oryx/application';
import { offlineServiceWorkerFulfillmentFeatures } from '@spryker-oryx/presets';
import { fallbackEnv } from '../src/fallback-env';

export const app = appBuilder()
  .withEnvironment({ ...fallbackEnv, ...process.env })
  .withFeature(offlineServiceWorkerFulfillmentFeatures())
  .create();
