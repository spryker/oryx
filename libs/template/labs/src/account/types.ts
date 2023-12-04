import { ExperienceComponent } from '@spryker-oryx/experience';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { EditTarget } from '@spryker-oryx/user/address-list-item';

interface Page {
  type: string;
  route: string; // tmp
  icon: IconTypes | string;
  component?: ExperienceComponent;
}

export const overviewPage: Page = {
  type: 'overview',
  route: 'account-overview',
  icon: IconTypes.User,
};

export const profilePage: Page = {
  type: 'profile',
  route: 'account-profile',
  icon: 'badge',
};

export const ordersPage: Page = {
  type: 'orders',
  route: 'account-orders',
  icon: IconTypes.History,
};

export const consentPage: Page = {
  type: 'consent',
  route: 'account-consent',
  icon: 'shield_locked',
};

export const addressesPage: Page = {
  type: 'addresses',
  route: 'account-addresses',
  icon: IconTypes.Location,
  component: {
    type: 'oryx-composition',
    options: {
      rules: [
        {
          layout: { type: 'list' },
        },
      ],
    },
    components: [
      {
        type: 'oryx-user-address-list',
        options: {
          editable: true,
          removable: true,
          editTarget: EditTarget.Link,
        },
      },
      {
        type: 'oryx-user-address-add-button',
        options: { target: 'link' },
      },
    ],
  },
};

export const cartsPage: Page = {
  type: 'carts',
  route: 'account-carts',
  icon: IconTypes.Cart,
};

export const wishListsPage: Page = {
  type: 'wishlists',
  route: 'account-wishlists',
  icon: IconTypes.Wishlist,
};

export const pages: Page[] = [
  overviewPage,
  profilePage,
  ordersPage,
  consentPage,
  addressesPage,
  cartsPage,
  wishListsPage,
];
