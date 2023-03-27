import { cartFeature } from '@spryker-oryx/cart';
import { AppFeature, coreFeature, Resources } from '@spryker-oryx/core';
import { PickingFeature, PickingFeatureConfig } from '@spryker-oryx/picking';
import { WebPushNotificationFeature } from '@spryker-oryx/push-notification/web';
import { RouterFeature } from '@spryker-oryx/router';
import { fulfillmentTheme as theme } from '@spryker-oryx/themes';
import { uiFeature } from '@spryker-oryx/ui';
import { resourceGraphics } from '../../resources';
import {
  FulfillmentRootFeature,
  FulfillmentRootFeatureConfig,
} from './feature';

export const fulfillmentResources: Resources = {
  graphics: {
    ...resourceGraphics,
  },
};

export interface FulfillmentFeaturesConfig {
  fulfillmentRoot?: FulfillmentRootFeatureConfig;
  picking?: PickingFeatureConfig;
}

export function fulfillmentFeatures(
  config?: FulfillmentFeaturesConfig
): AppFeature[] {
  return [
    uiFeature,
    cartFeature,
    coreFeature,
    {
      resources: fulfillmentResources,
    },
    new WebPushNotificationFeature(),
    new RouterFeature(),
    new FulfillmentRootFeature(config?.fulfillmentRoot),
    new PickingFeature(config?.picking),
  ];
}

export const fulfillmentTheme = { ...theme };
