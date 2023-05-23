import { cartFeature } from '@spryker-oryx/cart';
import { AppFeature, coreFeature } from '@spryker-oryx/core';
import { Resources } from '@spryker-oryx/experience';
import {
  backofficeNgIcons,
  commonGraphics,
  IconTypes,
} from '@spryker-oryx/presets/resources';
import { uiFeature } from '@spryker-oryx/ui';

export const backofficeNgResources: Resources = {
  graphics: commonGraphics,
  icons: {
    list: backofficeNgIcons,
    types: IconTypes,
  },
};

export const backofficeNgFeatures: AppFeature[] = [
  uiFeature,
  cartFeature,
  coreFeature,
  {
    resources: backofficeNgResources,
  },
];
