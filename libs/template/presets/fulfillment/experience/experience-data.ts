import { AppFeature } from '@spryker-oryx/core';
import { provideExperienceData } from '@spryker-oryx/experience';
import {
  fulfillmentLoginPage,
  pickingListsPage,
  warehouseSelectionPage,
} from './pages';
import { UserProfileComponent } from './user-profile';

export const StaticExperienceFeature: AppFeature = {
  providers: [
    provideExperienceData([
      UserProfileComponent,
      fulfillmentLoginPage,
      warehouseSelectionPage,
      pickingListsPage,
    ]),
  ],
};
