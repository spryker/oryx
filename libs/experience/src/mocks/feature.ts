import { AppFeature } from '@spryker-oryx/core';
import { experienceFeature } from '@spryker-oryx/experience';
import { mockExperienceProviders } from './src';

export const mockExperienceFeature: AppFeature = {
  ...experienceFeature,
  providers: [
    ...(experienceFeature.providers ?? []),
    ...mockExperienceProviders,
  ],
};
