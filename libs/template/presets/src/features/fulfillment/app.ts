import { cartFeature } from '@spryker-oryx/cart';
import { AppFeature, coreFeature, Resources } from '@spryker-oryx/core';
import { fulfillmentTheme as theme } from '@spryker-oryx/themes';
import { uiFeature } from '@spryker-oryx/ui';
import { resourceGraphics } from '../../resources';

export const fulfillmentResources: Resources = {
  graphics: {
    ...resourceGraphics,
  },
};

export const fulfillmentFeatures: AppFeature[] = [
  uiFeature,
  cartFeature,
  coreFeature,
  {
    resources: fulfillmentResources,
  },
];

export const fulfillmentTheme = { ...theme };
