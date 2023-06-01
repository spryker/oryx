import { AppFeature } from '@spryker-oryx/core';
import { Resources } from '@spryker-oryx/experience';
import { backofficeFeatures } from '@spryker-oryx/presets/backoffice';
import { commonGraphics, materialDesignLink } from '@spryker-oryx/resources';

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
