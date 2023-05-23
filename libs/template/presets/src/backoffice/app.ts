import { AppFeature, coreFeature } from '@spryker-oryx/core';
import { Resources } from '@spryker-oryx/experience';
import { formFeature } from '@spryker-oryx/form';
import {
  backofficeIcons,
  commonGraphics,
  fontawesomeLink,
  IconTypes,
  materialDesignLink,
} from '@spryker-oryx/presets/resources';
import { siteFeature } from '@spryker-oryx/site';
import { uiFeature } from '@spryker-oryx/ui';

export const backofficeResources: Resources = {
  graphics: commonGraphics,
  icons: {
    list: backofficeIcons,
    types: IconTypes,
  },
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
  {
    resources: backofficeResources,
  },
];
