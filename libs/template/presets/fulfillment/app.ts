import { applicationFeature } from '@spryker-oryx/application';
import { BapiAuthComponentsFeature, BapiAuthFeature } from '@spryker-oryx/auth';
import { cartFeature } from '@spryker-oryx/cart';
import { contentFeature } from '@spryker-oryx/content';
import { AppFeature, PageMetaResolver, coreFeature } from '@spryker-oryx/core';
import { Resources, experienceFeature } from '@spryker-oryx/experience';
import { formFeature } from '@spryker-oryx/form';
import { I18nFeature, I18nFeatureOptions } from '@spryker-oryx/i18n';
import { PickingFeature, PickingFeatureConfig } from '@spryker-oryx/picking';
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
  return [
    uiFeature,
    cartFeature,
    coreFeature,
    ...(featureVersion >= '1.2'
      ? [siteFeature, formFeature, applicationFeature, contentFeature]
      : []),
    {
      //drop PageMetaResolver from experienceFeature
      //to exclude unnecessary functionality from SPA
      providers: experienceFeature.providers?.filter(
        (feature) => ![PageMetaResolver].includes(feature.provide)
      ),
      components: experienceFeature.components,
    },
    new RouterFeature(),
    new I18nFeature(config?.i18n),
    new WebPushNotificationFeature(),
    new BapiAuthFeature(),
    new BapiAuthComponentsFeature(),
    { resources: fulfillmentResources },
    featureVersion < '1.2'
      ? new FulfillmentRootFeature(config?.fulfillmentRoot)
      : [],
    new PickingFeature(config?.picking),
    StaticExperienceFeature,
  ];
}

export interface FulfillmentFeaturesConfig {
  /**
   * @deprecated Since version 1.2.
   */
  fulfillmentRoot?: FulfillmentRootFeatureConfig;
  picking?: PickingFeatureConfig;
  i18n?: I18nFeatureOptions;
}

export const fulfillmentResources: Resources = {
  graphics: { ...commonGraphics, ...fulfillmentResourceGraphics },
  fonts: materialDesignLink,
};
