import { AppFeature } from '@spryker-oryx/core';
import { experienceComponents } from '@spryker-oryx/experience';
import { mockExperienceProviders } from './src';

export const mockExperienceFeature: AppFeature = {
  components: experienceComponents,
  providers: mockExperienceProviders,
};
