import { ExperienceComponent } from '@spryker-oryx/experience';
import { RouteType } from '@spryker-oryx/router';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { EditTarget } from '@spryker-oryx/user/address-list-item';

interface Page {
  type: string;
  route: RouteType;
  path: string;
  icon: IconTypes | string;
  component?: ExperienceComponent;
}

export const overviewPage: Page = {
  type: 'overview',
  route: RouteType.AccountOverviewPage, // tmp
  path: '/my-account/overview',
  icon: IconTypes.User,
};

export const profilePage: Page = {
  type: 'profile',
  route: RouteType.AccountProfilePage, // tmp
  path: '/my-account/profile',
  icon: 'badge',
};

export const ordersPage: Page = {
  type: 'orders',
  route: RouteType.AccountOrdersPage, // tmp
  path: '/my-account/orders',
  icon: IconTypes.History,
};

export const consentPage: Page = {
  type: 'consent',
  route: RouteType.AccountConsentPage, // tmp
  path: '/my-account/consent',
  icon: 'shield_locked',
};

export const addressesPage: Page = {
  type: 'addresses',
  route: RouteType.AccountAddressesPage, // tmp
  path: '/my-account/addresses',
  icon: IconTypes.Location,
  component: {
    type: 'oryx-user-address-list',
    options: {
      editable: true,
      removable: true,
      editTarget: EditTarget.Link,
    },
  },
};

export const pages: Page[] = [
  overviewPage,
  profilePage,
  ordersPage,
  consentPage,
  addressesPage,
];
