import { AppFeature } from '@spryker-oryx/core';
import { provideExperienceData } from '@spryker-oryx/experience';
import { UserProfileComponent } from './user-profile';

export const StaticExperienceFeature: AppFeature = {
  providers: [provideExperienceData([UserProfileComponent])],
};
