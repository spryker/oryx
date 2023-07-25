import { AppFeature, coreFeature, PageMetaService } from '@spryker-oryx/core';
import { ServerPageMetaService } from '@spryker-oryx/core/server';
import { I18nFeature, I18nFeatureOptions } from '@spryker-oryx/i18n';
import {
  IndexedDbFeature,
  IndexedDbFeatureConfig,
} from '@spryker-oryx/indexed-db';
import {
  OfflineFeature,
  OfflineServiceWorkerFeature,
} from '@spryker-oryx/offline';
import {
  OfflinePickingFeature,
  SwAuthFeature,
  SwOfflinePickingFeature,
} from '@spryker-oryx/picking/offline';
import { RouterFeature } from '@spryker-oryx/router';
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

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface OfflineServiceWorkerFulfillmentFeaturesConfig
  extends SharedOfflineFulfillmentFeaturesConfig {
  i18n?: I18nFeatureOptions;
}

export function offlineServiceWorkerFulfillmentFeatures(
  config?: OfflineServiceWorkerFulfillmentFeaturesConfig
): AppFeature[] {
  config = {
    ...defaultOfflineFulfillmentConfig,
    ...config,
  };

  return [
    coreFeature,
    new I18nFeature(config?.i18n),
    new IndexedDbFeature(config?.indexedDb),
    new RouterFeature(),
    new SwAuthFeature(),
    new OfflineServiceWorkerFeature(),
    {
      providers: [
        {
          provide: PageMetaService,
          useClass: ServerPageMetaService,
        },
      ],
    },
    new SwOfflinePickingFeature(),
  ];
}
