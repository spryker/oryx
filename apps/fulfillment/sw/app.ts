import { bootstrap } from '@spryker-oryx/application/service-worker';
import { appBuilder } from '@spryker-oryx/application';
import { offlineServiceWorkerFulfillmentFeatures } from '../../../libs/template/presets/fulfillment';
import { fallbackEnv } from '../src/fallback-env';

appBuilder()
  .withEnvironment({ ...fallbackEnv, ...process.env })
  .withFeature(offlineServiceWorkerFulfillmentFeatures())
  .create()
  .then(() => console.debug('Service worker app started!'))
  .catch(console.error);

bootstrap();
