import { ExperienceComponent } from '@spryker-oryx/experience';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { Size, i18n } from '@spryker-oryx/utilities';

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

export const myAccountPage: ExperienceComponent = {
  id: 'my-account',
  type: 'Page',
  meta: {
    title: 'My account',
    route: '/my-account',
  },
  components: [
    { ref: 'header' },
    {
      type: 'oryx-composition',
      options: {
        rules: [
          {
            layout: { type: 'split', columnWidthType: 'aside' },
            padding: '30px 0 0',
          },
        ],
      },
      components: [
        {
          type: 'oryx-site-breadcrumb',
          options: {
            rules: [
              {
                colSpan: 2,
              },
              { query: { breakpoint: Size.Sm }, hide: true },
            ],
          },
        },
        { ref: 'myAccountNavigation' },
        {
          type: 'oryx-content-text',
          content: {
            data: {
              text: `<h1>My account</h1><p>content...</p>`,
            },
          },
        },
      ],
    },
    { ref: 'footer' },
  ],
};
