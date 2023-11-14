import { AppFeature, coreFeature } from '@spryker-oryx/core';
import {
  IndexedDbFeature,
  IndexedDbFeatureConfig,
} from '@spryker-oryx/indexed-db';
import { OfflineServiceWorkerFeature } from '@spryker-oryx/offline/service-worker';
import {
  AuthServiceWorkerFeature,
  OfflinePickingFeature,
} from '@spryker-oryx/picking/service-worker';
import { RouterFeature } from '@spryker-oryx/router';

export interface SharedOfflineFulfillmentFeaturesConfig {
  indexedDb?: IndexedDbFeatureConfig;
}

export const defaultOfflineFulfillmentConfig: SharedOfflineFulfillmentFeaturesConfig =
  {
    indexedDb: { dbName: 'fulfillment-app-db' },
  };

export function offlineServiceWorkerFulfillmentFeatures(
  config?: SharedOfflineFulfillmentFeaturesConfig
): AppFeature[] {
  config = {
    ...defaultOfflineFulfillmentConfig,
    ...config,
  };

  return [
    coreFeature,
    new IndexedDbFeature(config?.indexedDb),
    new RouterFeature(),
    new OfflineServiceWorkerFeature(),
    new AuthServiceWorkerFeature(),
    new OfflinePickingFeature(),
  ];
}
