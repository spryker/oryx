import { ExperienceComponent } from '@spryker-oryx/experience';

export const accountPage: ExperienceComponent = {
  id: 'account-page',
  type: 'Page',
  meta: {
    title: 'Account Page',
    route: '/account/:page',
  },
  options: {
    rules: [
      {
        layout: 'grid',
      },
    ],
  },
  components: [
    { ref: 'account-menu' },
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
          { layout: 'list', height: '100%', colSpan: 3 },
          { query: { breakpoint: 'md' }, colSpan: 2 },
        ],
      },
    },
  ],
};
