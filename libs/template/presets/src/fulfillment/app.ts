import {
  BapiAuthComponentsFeature,
  BapiAuthFeature,
} from '@spryker-oryx/application';
import { cartFeature } from '@spryker-oryx/cart';
import { AppFeature, coreFeature } from '@spryker-oryx/core';
import { Resources } from '@spryker-oryx/experience';
import { I18nFeature, I18nFeatureOptions } from '@spryker-oryx/i18n';
import { PickingFeature, PickingFeatureConfig } from '@spryker-oryx/picking';
import {
  commonGraphics,
  fontIcons,
  fulfillmentIcons,
  fulfillmentResourceGraphics,
} from '@spryker-oryx/presets/resources';
import { WebPushNotificationFeature } from '@spryker-oryx/push-notification/web';
import { RouterFeature } from '@spryker-oryx/router';
import { fulfillmentTheme as theme } from '@spryker-oryx/themes';
import { uiFeature } from '@spryker-oryx/ui';
import {
  FulfillmentRootFeature,
  FulfillmentRootFeatureConfig,
} from './feature';

export function fulfillmentFeatures(
  config?: FulfillmentFeaturesConfig
): AppFeature[] {
  return [
    uiFeature,
    cartFeature,
    coreFeature,
    new RouterFeature(),
    new I18nFeature(config?.i18n),
    new WebPushNotificationFeature(),
    new BapiAuthFeature(),
    new BapiAuthComponentsFeature(),
    { resources: fulfillmentResources },
    new FulfillmentRootFeature(config?.fulfillmentRoot),
    new PickingFeature(config?.picking),
  ];
}

export interface FulfillmentFeaturesConfig {
  fulfillmentRoot?: FulfillmentRootFeatureConfig;
  picking?: PickingFeatureConfig;
  i18n?: I18nFeatureOptions;
}

export const fulfillmentTheme = { ...theme };

export const fulfillmentResources: Resources = {
  graphics: { ...commonGraphics, ...fulfillmentResourceGraphics },
  icons: fulfillmentIcons,
  fonts: fontIcons,
};
