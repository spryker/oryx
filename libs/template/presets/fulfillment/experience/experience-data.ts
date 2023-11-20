import { AppFeature } from '@spryker-oryx/core';
import { provideExperienceData } from '@spryker-oryx/experience';
import {
  customerNotePage,
  fulfillmentLoginPage,
  pickingListsPage,
  pickingPickerPage,
  warehouseSelectionPage,
} from './pages';
import { ServiceTemplate } from './service';
import { UserProfileComponent } from './user-profile';

export const StaticExperienceFeature: AppFeature = {
  providers: [
    provideExperienceData([
      UserProfileComponent,
      fulfillmentLoginPage,
      warehouseSelectionPage,
      pickingListsPage,
      customerNotePage,
      pickingPickerPage,
      ServiceTemplate,
    ]),
  ],
};
