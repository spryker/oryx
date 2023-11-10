import { ExperienceComponent } from '@spryker-oryx/experience';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { i18n } from '@spryker-oryx/utilities';

export const myAccountNavigation: ExperienceComponent = {
  type: 'oryx-composition',
  id: 'myAccountNavigation',
  components: [
    {
      type: 'oryx-content-link',
      content: { data: { text: i18n('my-account.navigation.overview') } },
      options: {
        url: '/my-account',
        icon: IconTypes.User,
      },
    },
    {
      type: 'oryx-content-link',
      content: { data: { text: i18n('my-account.navigation.profile') } },
      options: {
        url: '/my-account/profile',
        icon: IconTypes.User,
      },
    },
    {
      type: 'oryx-content-link',
      content: { data: { text: i18n('my-account.navigation.addresses') } },
      options: {
        url: '/my-account/addresses',
        icon: IconTypes.Location,
      },
    },
    {
      type: 'oryx-content-link',
      content: { data: { text: i18n('my-account.navigation.order-history') } },
      options: {
        url: '/my-account/orders',
        icon: IconTypes.History,
      },
    },
    {
      type: 'oryx-content-link',
      content: { data: { text: i18n('my-account.navigation.carts') } },
      options: {
        url: '/my-account/wishlist',
        icon: IconTypes.Cart,
      },
    },
    {
      type: 'oryx-content-link',
      content: { data: { text: i18n('my-account.navigation.wishlist') } },
      options: {
        url: '/my-account/wishlist',
        icon: IconTypes.Wishlist,
      },
    },
  ],
  options: {
    rules: [
      {
        layout: {
          type: 'navigation',
          vertical: true,
          // divider: true,
        },
        gap: '0px',
      },
    ],
  },
};
