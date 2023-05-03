import { cartFeature } from '@spryker-oryx/cart';
import { AppFeature, coreFeature } from '@spryker-oryx/core';
import { Resources } from '@spryker-oryx/experience';
import { backofficeNgTheme as theme } from '@spryker-oryx/themes';
import { uiFeature } from '@spryker-oryx/ui';
import { resourceGraphics } from '../../resources';

export const backofficeNgResources: Resources = {
  graphics: {
    ...resourceGraphics,
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

export const backofficeNgTheme = { ...theme };
