import { ExperienceComponent } from '@spryker-oryx/experience';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { pages } from './types';

export const accountNavigation: ExperienceComponent = {
  type: 'oryx-composition',
  id: 'accountNavigation',

  options: {
    rules: [
      {
        layout: {
          type: 'navigation',
          vertical: true,
        },
        gap: '0px',
      },
    ],
  },

  components: pages.map((page) => ({
    type: 'oryx-content-link',
    content: { data: { text: page.type } },
    options: {
      id: page.type,
      type: page.route,
      icon: page.icon,
    },
  })),
};

export const UserHeaderNavigation = {
  id: 'user-header-navigation',
  type: 'oryx-user-navigation-control',
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
      options: { rules: [{ divider: true }] },
    },
  ],
  options: {
    rules: [{ layout: { navigationType: 'dropdown' } }],
  },
};
