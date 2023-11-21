import { AppFeature } from '@spryker-oryx/core';
import { provideExperienceData } from '@spryker-oryx/experience';
import {
  customerNotePage,
  fulfillmentLoginPage,
  pickingListsPage,
  pickingPickerPage,
  warehouseSelectionPage,
} from './pages';
import {
  HeaderPickerTemplate,
  HeaderPickingListsTemplate,
  HeaderTemplate,
  ServiceTemplate,
} from './templates';

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
      HeaderPickingListsTemplate,
      HeaderPickerTemplate,
    ]),
  ],
};
