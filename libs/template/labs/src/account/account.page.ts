import { ExperienceComponent } from '@spryker-oryx/experience';
import { RouteType } from '@spryker-oryx/router';
import { Size } from '@spryker-oryx/utilities';

export const myAccountPage: ExperienceComponent = {
  id: 'my-account',
  type: 'Page',
  meta: {
    title: 'My account',
    route: '/my-account',
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
        { ref: 'myAccountNavigation' },
        {
          type: 'oryx-content-text',
          content: {
            data: {
              text: `<h1>My account</h1><p>content...</p>`,
            },
          },
        },
        {
          type: 'oryx-composition',
          options: { rules: [{ layout: 'navigation' }] },
          components: [
            {
              type: 'oryx-content-link',
              content: { data: { text: 'Login' } },
              options: {
                icon: 'person',
                rules: [{ layout: { navigationType: 'dropdown' } }],
              },
              components: [
                {
                  type: 'oryx-content-link',
                  options: { type: RouteType.Login },
                  content: { data: { text: 'Login' } },
                },
                {
                  type: 'oryx-content-link',
                  options: { type: RouteType.MyAccount },
                  content: { data: { text: 'My account' } },
                },
              ],
            },
          ],
        },
      ],
    },
    { ref: 'footer' },
  ],
};

export const accountProfilePage: ExperienceComponent = {
  id: 'profile',
  type: 'Page',
  meta: {
    title: 'Your profile',
    route: '/my-account/profile',
    index: false,
  },
  components: [{ ref: 'header' }],
};
