import { ExperienceComponent } from '@spryker-oryx/experience';

export const accountPage: ExperienceComponent = {
  id: 'account-page',
  type: 'Page',
  meta: {
    title: 'Account Page',
    route: '/account/:tab',
  },
  options: {
    rules: [
      {
        layout: 'split-aside',
      },
    ],
  },
  components: [
    {
      type: 'oryx-composition',
      id: 'account-menu',
      components: [{ type: 'oryx-user-account-menu' }],
    },
    {
      type: 'oryx-composition',
      id: 'account-content',
      components: [
        {
          type: 'oryx-content-text',
          content: {
            data: {
              text: 'This page is not implemented yet',
            },
          },
        },
      ],
      options: {
        rules: [
          { layout: 'list' },
          {
            height: '100%',
          },
        ],
      },
    },
  ],
};
