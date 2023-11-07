import { AppFeature, coreFeature } from '@spryker-oryx/core';
// import { ServerPageMetaService } from '@spryker-oryx/core/server';
// import { I18nFeature, I18nFeatureOptions } from '@spryker-oryx/i18n';
import {
  IndexedDbFeature,
  IndexedDbFeatureConfig,
} from '@spryker-oryx/indexed-db';
import {
  OfflineServiceWorkerFeature,
} from '@spryker-oryx/offline';
import {
  SwAuthFeature,
  SwOfflinePickingFeature,
} from '@spryker-oryx/picking/offline';
import { RouterFeature } from '@spryker-oryx/router'; 

export interface SharedOfflineFulfillmentFeaturesConfig {
  indexedDb?: IndexedDbFeatureConfig;
}

//TODO:OFFLINE extract configs
export const defaultOfflineFulfillmentConfig: SharedOfflineFulfillmentFeaturesConfig =
  {
    indexedDb: { dbName: 'fulfillment-app-db' },
  };

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface OfflineServiceWorkerFulfillmentFeaturesConfig
  extends SharedOfflineFulfillmentFeaturesConfig {
  // i18n?: I18nFeatureOptions;
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
    // new I18nFeature(config?.i18n),
    new IndexedDbFeature(config?.indexedDb),
    new RouterFeature(),
    new SwAuthFeature(),
    new OfflineServiceWorkerFeature(),
    // {
    //   providers: [
    //     {
    //       provide: PageMetaService,
    //       useClass: ServerPageMetaService,
    //     },
    //   ],
    // },
    new SwOfflinePickingFeature(),
  ];
}
