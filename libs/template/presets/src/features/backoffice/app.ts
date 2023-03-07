import { AppFeature, coreFeature, Resources } from '@spryker-oryx/core';
import { formFeature } from '@spryker-oryx/form';
import { siteFeature } from '@spryker-oryx/site';
import { backofficeTheme as theme } from '@spryker-oryx/themes';
import { uiFeature } from '@spryker-oryx/ui';
import { resourceGraphics } from '../../resources';

export const backofficeResources: Resources = {
  graphics: {
    ...resourceGraphics,
  },
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
