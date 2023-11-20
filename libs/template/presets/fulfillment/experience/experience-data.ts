import { AppFeature } from '@spryker-oryx/core';
import { provideExperienceData } from '@spryker-oryx/experience';
import { 
  HeaderTemplate,
  ServiceTemplate,
  HeaderPickingListsTemplate
} from './templates';
import {
  customerNotePage,
  fulfillmentLoginPage,
  pickingListsPage,
  pickingPickerPage,
  warehouseSelectionPage,
} from './pages';

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
    ]),
  ],
};
