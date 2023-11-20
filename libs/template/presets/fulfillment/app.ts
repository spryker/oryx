import { applicationFeature } from '@spryker-oryx/application';
import { BapiAuthComponentsFeature, BapiAuthFeature } from '@spryker-oryx/auth';
import { contentFeature } from '@spryker-oryx/content';
import { AppFeature, coreFeature } from '@spryker-oryx/core';
import { Resources, experienceFeature } from '@spryker-oryx/experience';
import { formFeature } from '@spryker-oryx/form';
import { I18nFeature, I18nFeatureOptions } from '@spryker-oryx/i18n';
import {
  IndexedDbFeature,
  IndexedDbFeatureConfig,
} from '@spryker-oryx/indexed-db';
import { OfflineFeature } from '@spryker-oryx/offline';
import { PickingFeature, PickingFeatureConfig } from '@spryker-oryx/picking';
import { OfflinePickingFeature } from '@spryker-oryx/picking/offline';
import { WebPushNotificationFeature } from '@spryker-oryx/push-notification/web';
import {
  commonGraphics,
  fulfillmentResourceGraphics,
  materialDesignLink,
} from '@spryker-oryx/resources';
import { RouterFeature } from '@spryker-oryx/router';
import { siteFeature } from '@spryker-oryx/site';
import { uiFeature } from '@spryker-oryx/ui';
import { featureVersion } from '@spryker-oryx/utilities';
import { StaticExperienceFeature } from './experience';
import {
  FulfillmentRootFeature,
  FulfillmentRootFeatureConfig,
} from './feature';

delete applicationFeature.plugins;

export function fulfillmentFeatures(
  config?: FulfillmentFeaturesConfig
): AppFeature[] {
  const onlineFeatures = [
    uiFeature,
    coreFeature,
    ...(featureVersion >= '1.2'
      ? [siteFeature, formFeature, applicationFeature, contentFeature]
      : []),
    experienceFeature,
    new RouterFeature(),
    new I18nFeature(config?.i18n),
    new WebPushNotificationFeature(),
    new BapiAuthFeature(),
    new BapiAuthComponentsFeature(),
    { resources: fulfillmentResources },
    featureVersion >= '1.2'
      ? []
      : new FulfillmentRootFeature(config?.fulfillmentRoot),
    new PickingFeature(config?.picking),
    StaticExperienceFeature,
  ];

  if (featureVersion >= '1.3') {
    config = {
      ...defaultFulfillmentConfig,
      ...config,
    };
    return [
      ...onlineFeatures,
      new IndexedDbFeature(config?.indexedDb),
      new OfflineFeature(),
      new OfflinePickingFeature(),
    ];
  }

  return onlineFeatures;
}

export interface FulfillmentFeaturesConfig {
  /**
   * @deprecated Since version 1.2.
   */
  fulfillmentRoot?: FulfillmentRootFeatureConfig;
  picking?: PickingFeatureConfig;
  i18n?: I18nFeatureOptions;

  /**
   * @since version 1.3
   */
  indexedDb?: IndexedDbFeatureConfig;
}

export const fulfillmentResources: Resources = {
  graphics: { ...commonGraphics, ...fulfillmentResourceGraphics },
  fonts: materialDesignLink,
};

/**
 * @deprecated Since version 1.3, indexedDb is now part of the standard fulfillmentFeatures config.
 */
export interface SharedOfflineFulfillmentFeaturesConfig {
  indexedDb?: IndexedDbFeatureConfig;
}

/**
 * @deprecated Since version 1.3, use FulfillmentFeaturesConfig instead.
 */
export interface OfflineFulfillmentFeaturesConfig
  extends FulfillmentFeaturesConfig,
    SharedOfflineFulfillmentFeaturesConfig {}

/**
 * @deprecated Since version 1.3, use defaultFulfillmentConfig instead.
 */
export const defaultOfflineFulfillmentConfig: SharedOfflineFulfillmentFeaturesConfig =
  {
    indexedDb: { dbName: 'fulfillment-app-db' },
  };

export const defaultFulfillmentConfig: FulfillmentFeaturesConfig =
  defaultOfflineFulfillmentConfig;

/**
 * @deprecated Since version 1.3, use fulfillmentFeatures instead.
 */
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
