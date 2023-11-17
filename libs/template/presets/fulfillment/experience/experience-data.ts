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
import { HeaderTemplate } from './header';

export const StaticExperienceFeature: AppFeature = {
  providers: [
    provideExperienceData([
      fulfillmentLoginPage,
      warehouseSelectionPage,
      pickingListsPage,
      customerNotePage,
      pickingPickerPage,
      ServiceTemplate,
      HeaderTemplate,
    ]),
  ],
};
