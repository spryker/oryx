import { AppFeature, coreFeature } from '@spryker-oryx/core';
import { Resources } from '@spryker-oryx/experience';
import {
  commonGraphics,
  fontawesomeLink,
  materialDesignLink,
} from '@spryker-oryx/resources';
import { siteFeature } from '@spryker-oryx/site';
import { uiFeature } from '@spryker-oryx/ui';
import { formFeature } from 'libs/platform/form/src';

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
  {
    resources: backofficeResources,
  },
];
