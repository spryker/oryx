import { AppFeature } from '@spryker-oryx/core';
import { provideExperienceData } from '@spryker-oryx/experience';
import { myAccountNavigation } from './my-account-navigation.ref';
import { myAccountPage } from './my-account.page';

/**
 * Initial landing page for My Account. we keep it in labs for now
 * as it's not yet production ready. Once the first my account pages are
 * added, we'll release it as a feature in the presets package.
 */
export const myAccountFeature: AppFeature = {
  providers: [provideExperienceData([myAccountNavigation, myAccountPage])],
};
