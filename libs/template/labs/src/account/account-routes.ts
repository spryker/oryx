import { RouteConfig } from '@spryker-oryx/router/lit';
import { pages } from './types';

export const accountRoutes: RouteConfig[] = pages.map((page) => ({
  type: page.route,
  path: `/my-account/${page.type}`,
}));

// export const accountRoutes: RouteConfig[] = [
//   {
//     type: RouteType.AccountOverviewPage,
//     path: '/my-account/overview',
//   },
//   {
//     type: RouteType.AccountProfilePage,
//     path: '/my-account/profile',
//   },
//   {
//     type: RouteType.AccountOrdersPage,
//     path: '/my-account/orders',
//   },
// ];
