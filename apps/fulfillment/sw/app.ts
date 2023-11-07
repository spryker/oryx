// organize-imports-ignore
import { bootstrap, appBuilder } from '@spryker-oryx/application/service-worker';
import { offlineServiceWorkerFulfillmentFeatures } from '@spryker-oryx/presets/fulfillment-sw';

appBuilder()
  .withEnvironment(process.env)
  .withFeature(offlineServiceWorkerFulfillmentFeatures())
  .create()
  .then(() => console.debug('Service worker app started!'))
  .catch(console.error);

bootstrap();
