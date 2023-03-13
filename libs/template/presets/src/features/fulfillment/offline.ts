import { AppFeature, coreFeature } from '@spryker-oryx/core';
import {
  IndexedDbFeature,
  IndexedDbFeatureConfig,
} from '@spryker-oryx/indexed-db';
import {
  OfflineFeature,
  OfflineServiceWorkerFeature,
} from '@spryker-oryx/offline';
import { OfflinePickingFeature } from '@spryker-oryx/picking/offline';
import { fulfillmentFeatures, FulfillmentFeaturesConfig } from './app';

export interface SharedOfflineFulfillmentFeaturesConfig {
  indexedDb?: IndexedDbFeatureConfig;
}

export interface OfflineFulfillmentFeaturesConfig
  extends FulfillmentFeaturesConfig,
    SharedOfflineFulfillmentFeaturesConfig {}

export const defaultOfflineFulfillmentConfig: SharedOfflineFulfillmentFeaturesConfig =
  {
    indexedDb: { dbName: 'fulfillment-app-db' },
  };

export function offlineFulfillmentFeatures(
  config?: OfflineFulfillmentFeaturesConfig
): AppFeature[] {
  return [
    ...fulfillmentFeatures(config),
    new IndexedDbFeature({
      ...defaultOfflineFulfillmentConfig.indexedDb,
      ...config?.indexedDb,
    }),
    new OfflineFeature(),
    new OfflinePickingFeature(),
  ];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface OfflineServiceWorkerFulfillmentFeaturesConfig
  extends SharedOfflineFulfillmentFeaturesConfig {}

export function offlineServiceWorkerFulfillmentFeatures(
  config?: OfflineServiceWorkerFulfillmentFeaturesConfig
): AppFeature[] {
  return [
    coreFeature,
    new IndexedDbFeature({
      ...defaultOfflineFulfillmentConfig.indexedDb,
      ...config?.indexedDb,
    }),
    new OfflineServiceWorkerFeature(),
    new OfflinePickingFeature(),
  ];
}
