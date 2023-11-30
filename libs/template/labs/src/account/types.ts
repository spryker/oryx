import { ExperienceComponent } from '@spryker-oryx/experience';
import { RouteType } from '@spryker-oryx/router';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { EditTarget } from '@spryker-oryx/user/address-list-item';

interface Page {
  type: string;
  route: RouteType;
  icon: IconTypes | string;
  component?: ExperienceComponent;
}

export const overviewPage: Page = {
  type: 'overview',
  route: RouteType.AccountOverviewPage, // tmp
  icon: IconTypes.User,
};

export const profilePage: Page = {
  type: 'profile',
  route: RouteType.AccountProfilePage, // tmp
  icon: 'badge',
};

export const ordersPage: Page = {
  type: 'orders',
  route: RouteType.AccountOrdersPage, // tmp
  icon: IconTypes.History,
};

export const consentPage: Page = {
  type: 'consent',
  route: RouteType.AccountConsentPage, // tmp
  icon: 'shield_locked',
};

export const addressesPage: Page = {
  type: 'addresses',
  route: RouteType.AccountAddressesPage, // tmp
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
  route: RouteType.AccountCartsPage, // tmp
  icon: IconTypes.Cart,
};

export const wishListsPage: Page = {
  type: 'wishlists',
  route: RouteType.AccountWishListsPage, // tmp
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
