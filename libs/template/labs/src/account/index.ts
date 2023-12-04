import { AppFeature } from '@spryker-oryx/core';
import { provideExperienceData } from '@spryker-oryx/experience';
import { provideLitRoutes } from '@spryker-oryx/router/lit';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { Size } from '@spryker-oryx/utilities';
import {
  accountNavigation,
  userHeaderNavigation,
} from './account-navigation.ref.js';
import { accountRoutes } from './account-routes';
import { accountPages } from './account.page';

/**
 * Initial landing page for My Account. we keep it in labs for now
 * as it's not yet production ready. Once the first my account pages are
 * added, we'll release it as a feature in the presets package.
 */
export const accountFeature: AppFeature = {
  providers: [
    ...provideLitRoutes({ routes: accountRoutes }),
    provideExperienceData([
      accountNavigation,
      ...accountPages,
      {
        merge: {
          selector: 'header-actions',
        },
        components: [
          userHeaderNavigation,
          {
            type: 'oryx-site-navigation-item',
            options: {
              label: 'cart',
              badge: 'CART.SUMMARY',
              icon: IconTypes.Cart,
              url: { type: 'cart' },
            },
          },
        ],
        options: {
          rules: [
            { colSpan: 3, layout: 'navigation', justify: 'end' },
            {
              query: { breakpoint: Size.Md },
              colSpan: 2,
            },
            { query: { breakpoint: Size.Sm }, colSpan: 2 },
          ],
        },
      },
    ]),
  ],
};
