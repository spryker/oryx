import { AppFeature } from '@spryker-oryx/core';
import { Resources } from '@spryker-oryx/experience';
import { commonGraphics, materialDesignLink } from '@spryker-oryx/resources';
import { backofficeFeatures } from '../backoffice';

export const fesResources: Resources = {
  graphics: commonGraphics,
  fonts: materialDesignLink,
};

export const fesFeatures: AppFeature[] = [
  ...backofficeFeatures.filter((f) => !f.resources),
  {
    resources: fesResources,
  },
];
