import { ExperienceComponent } from '@spryker-oryx/experience';
import { Size } from '@spryker-oryx/utilities';
import { pages } from './types';

// export const myAccountPage: ExperienceComponent = {
//   id: 'my-account',
//   type: 'Page',
//   meta: {
//     title: 'My account',
//     route: '/my-account',
//     index: false,
//   },
//   components: [
//     { ref: 'header' },
//     {
//       type: 'oryx-composition',
//       options: {
//         rules: [
//           {
//             layout: { type: 'split', columnWidthType: 'aside' },
//             padding: '30px 0 0',
//           },
//         ],
//       },
//       components: [
//         {
//           type: 'oryx-site-breadcrumb',
//           options: {
//             rules: [
//               {
//                 colSpan: 2,
//               },
//               { query: { breakpoint: Size.Sm }, hide: true },
//             ],
//           },
//         },
//         { ref: 'myAccountNavigation' },
//         {
//           type: 'oryx-content-text',
//           content: {
//             data: {
//               text: `<h1>My account</h1><p>content...</p>`,
//             },
//           },
//         },
//         {
//           type: 'oryx-composition',
//           options: { rules: [{ layout: 'navigation' }] },
//           components: [
//             {
//               type: 'oryx-content-link',
//               content: { data: { text: 'Login' } },
//               options: {
//                 icon: 'person',
//                 rules: [{ layout: { navigationType: 'dropdown' } }],
//               },
//               components: [
//                 {
//                   type: 'oryx-content-link',
//                   options: { type: RouteType.Login },
//                   content: { data: { text: 'Login' } },
//                 },
//                 {
//                   type: 'oryx-content-link',
//                   options: { type: RouteType.MyAccount },
//                   content: { data: { text: 'My account' } },
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     },
//     { ref: 'footer' },
//   ],
// };

const accountPage = (
  id: string,
  meta: { title: string; route: string },
  component: ExperienceComponent = {}
): ExperienceComponent => {
  return {
    id,
    type: 'Page',
    meta: {
      title: meta.title,
      route: meta.route,
      index: false,
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
          { ref: 'accountNavigation' },
          component,
        ],
      },
    ],
  };
};

export const accountPages = pages.map((page) =>
  accountPage(page.type, { route: page.path, title: page.type }, page.component)
);

// export const accountOverviewPage = accountPage(
//   'account/overview',
//   {
//     title: 'Account overview',
//     route: '/my-account/overview',
//   },
//   {}
// );

// export const accountProfilePage = accountPage(
//   'account/profile',
//   {
//     title: 'Your profile',
//     route: '/my-account/profile',
//   },
//   {}
// );

// export const accountOrdersPage = accountPage(
//   'account/orders',
//   {
//     title: 'Orders history',
//     route: '/my-account/orders',
//   },
//   {}
// );
