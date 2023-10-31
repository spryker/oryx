import { AppFeature } from '@spryker-oryx/core';
import { provideExperienceData } from '@spryker-oryx/experience';
import { fulfillmentLoginPage } from './login-page';
import { UserProfileComponent } from './user-profile';

export const StaticExperienceFeature: AppFeature = {
  providers: [
    provideExperienceData([UserProfileComponent, fulfillmentLoginPage]),
  ],
};
