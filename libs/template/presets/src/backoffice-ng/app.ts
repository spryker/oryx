import { cartFeature } from '@spryker-oryx/cart';
import { AppFeature, coreFeature } from '@spryker-oryx/core';
import { Resources } from '@spryker-oryx/experience';
import { commonGraphics } from '@spryker-oryx/resources';
import { uiFeature } from '@spryker-oryx/ui';

export const backofficeNgResources: Resources = {
  graphics: commonGraphics,
};

export const backofficeNgFeatures: AppFeature[] = [
  uiFeature,
  cartFeature,
  coreFeature,
  {
    resources: backofficeNgResources,
  },
];
