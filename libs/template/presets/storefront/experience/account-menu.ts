import { IconTypes } from '@spryker-oryx/ui/icon';
import { i18n } from '@spryker-oryx/utilities';

export const accountMenu = {
  type: 'oryx-composition',
  id: 'account-menu',
  options: {
    rules: [{ vertical: true, gap: 0 }],
  },
  components: [
    {
      type: 'oryx-site-menu-item',
      content: {
        data: {
          text: i18n('user.overview'),
        },
      },
      options: {
        type: 'account',
        id: 'overview',
        icon: IconTypes.Description,
      },
    },
    {
      type: 'oryx-site-menu-item',
      content: {
        data: {
          text: i18n('user.profile'),
        },
      },
      options: {
        type: 'account',
        id: 'profile',
        icon: IconTypes.User,
      },
    },
    {
      type: 'oryx-site-menu-item',
      content: {
        data: {
          text: i18n('user.addresses'),
        },
      },
      options: {
        type: 'account',
        id: 'addresses',
        icon: IconTypes.Location,
      },
    },
    {
      type: 'oryx-site-menu-item',
      content: {
        data: {
          text: i18n('user.order-history'),
        },
      },
      options: {
        type: 'account',
        id: 'order-history',
        icon: IconTypes.History,
      },
    },
  ],
};
