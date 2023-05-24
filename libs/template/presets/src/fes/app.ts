import { AppFeature } from '@spryker-oryx/core';
import { Resources } from '@spryker-oryx/experience';
import {
  commonGraphics,
  IconTypes,
  materialDesignLink,
} from '@spryker-oryx/presets/resources';
import { backofficeFeatures } from '../backoffice';

export const fesResources: Resources = {
  graphics: commonGraphics,
  icons: { types: IconTypes },
  fonts: materialDesignLink,
};

export const fesFeatures: AppFeature[] = [
  ...backofficeFeatures.filter((f) => !f.resources),
  {
    resources: fesResources,
  },
];
