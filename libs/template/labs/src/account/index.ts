import { AppFeature } from '@spryker-oryx/core';
import { provideExperienceData } from '@spryker-oryx/experience';
import { provideLitRoutes } from '@spryker-oryx/router/lit';
import { accountNavigation } from './account-navigation.ref.js';
import { accountRoutes } from './account-routes';
import { accountPages } from './account.page.js';

/**
 * Initial landing page for My Account. we keep it in labs for now
 * as it's not yet production ready. Once the first my account pages are
 * added, we'll release it as a feature in the presets package.
 */
export const myAccountFeature: AppFeature = {
  providers: [
    ...provideLitRoutes({ routes: accountRoutes }),
    provideExperienceData([accountNavigation, ...accountPages]),
  ],
};
