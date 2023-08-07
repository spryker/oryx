import { AppFeature, coreFeature } from '@spryker-oryx/core';
import { Resources, layoutFeature } from '@spryker-oryx/experience';
import { formFeature } from '@spryker-oryx/form';
import {
  commonGraphics,
  fontawesomeLink,
  materialDesignLink,
} from '@spryker-oryx/resources';
import { siteFeature } from '@spryker-oryx/site';
import { uiFeature } from '@spryker-oryx/ui';

export const backofficeResources: Resources = {
  graphics: commonGraphics,
  fonts: {
    ...fontawesomeLink,
    ...materialDesignLink,
  },
};

export const backofficeFeatures: AppFeature[] = [
  uiFeature,
  coreFeature,
  formFeature,
  siteFeature,
  layoutFeature,
  {
    resources: backofficeResources,
  },
];
