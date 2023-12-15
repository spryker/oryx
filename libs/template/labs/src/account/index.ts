import { AppFeature } from '@spryker-oryx/core';
import { provideExperienceData } from '@spryker-oryx/experience';
import { provideLitRoutes } from '@spryker-oryx/router/lit';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { Size } from '@spryker-oryx/utilities';
import { accountNavigation } from './account-navigation.ref.js';
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
        merge: { selector: 'header-actions' },
        components: [
          {
            type: 'oryx-user-navigation-control',
            options: {
              rules: [
                {
                  layout: {
                    dropdown: true,
                    dropdownPosition: 'start',
                    dropdownVerticalAlign: true,
                  },
                },
              ],
            },
            components: [
              {
                type: 'oryx-content-link',
                options: {
                  type: 'account-overview',
                  id: 'overview',
                  icon: IconTypes.User,
                },
                content: { data: { text: 'Overview' } },
              },
              {
                type: 'oryx-content-link',
                options: {
                  type: 'account-profile',
                  id: 'profile',
                  icon: 'badge',
                },
                content: { data: { text: 'Profile' } },
              },
              {
                type: 'oryx-content-link',
                options: {
                  type: 'account-orders',
                  id: 'orders',
                  icon: IconTypes.History,
                },
                content: { data: { text: 'Order History' } },
              },
              {
                type: 'oryx-auth-logout-link',
                options: { icon: IconTypes.Logout },
              },
            ],
          },
          // {
          //   type: 'oryx-composition',

          //   options: {
          //     rules: [
          //       {
          //         layout: {
          //           // type: 'navigation',
          //           // navigationType: 'dropdown',
          //           type: 'navigation',
          //           dropdown: true,
          //           dropdownTrigger: 'oryx-user-navigation-control',
          //           //           // dropdownPosition: 'start',
          //           //           // dropdownVerticalAlign: true,
          //         },
          //       },
          //     ],
          //   },
          //   components: [
          //     {
          //       type: 'oryx-content-link',
          //       options: {
          //         type: 'account-overview',
          //         id: 'overview',
          //         icon: IconTypes.User,
          //       },
          //       content: { data: { text: 'Overview' } },
          //     },
          //     {
          //       type: 'oryx-content-link',
          //       options: {
          //         type: 'account-profile',
          //         id: 'profile',
          //         icon: 'badge',
          //       },
          //       content: { data: { text: 'Profile' } },
          //     },
          //     {
          //       type: 'oryx-content-link',
          //       options: {
          //         type: 'account-orders',
          //         id: 'orders',
          //         icon: IconTypes.History,
          //       },
          //       content: { data: { text: 'Order History' } },
          //     },
          //     {
          //       type: 'oryx-auth-logout-link',
          //       options: { icon: IconTypes.Logout },
          //     },
          //   ],
          // },
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
            {
              colSpan: 2,
              layout: 'navigation',
              justify: 'end',
            },
            { query: { breakpoint: Size.Lg }, colSpan: 3 },
          ],
        },
      },
    ]),
  ],
};
