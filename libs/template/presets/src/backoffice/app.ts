import { AppFeature, coreFeature } from '@spryker-oryx/core';
import { Resources } from '@spryker-oryx/experience';
import { formFeature } from '@spryker-oryx/form';
import {
  backofficeIcons,
  commonGraphics,
} from '@spryker-oryx/presets/resources';
import { siteFeature } from '@spryker-oryx/site';
import { backofficeTheme as theme } from '@spryker-oryx/themes';
import { uiFeature } from '@spryker-oryx/ui';

export const backofficeResources: Resources = {
  graphics: commonGraphics,
  icons: backofficeIcons,
};

export const backofficeFeatures: AppFeature[] = [
  uiFeature,
  coreFeature,
  formFeature,
  siteFeature,
  {
    resources: backofficeResources,
  },
];

export const backofficeTheme = { ...theme };
