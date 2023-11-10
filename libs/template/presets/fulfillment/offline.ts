import { AppFeature } from '@spryker-oryx/core';
import {
  IndexedDbFeature,
  IndexedDbFeatureConfig,
} from '@spryker-oryx/indexed-db';
import { OfflineFeature } from '@spryker-oryx/offline';
import { OfflinePickingFeature } from '@spryker-oryx/picking/offline';
import { FulfillmentFeaturesConfig, fulfillmentFeatures } from './app';

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
  config = {
    ...defaultOfflineFulfillmentConfig,
    ...config,
  };

  return [
    ...fulfillmentFeatures(config),
    new IndexedDbFeature(config?.indexedDb),
    new OfflineFeature(),
    new OfflinePickingFeature(),
  ];
}
