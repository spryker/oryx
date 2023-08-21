import { ExperienceComponent } from '@spryker-oryx/experience';

export const overviewPage: ExperienceComponent = {
  id: 'overview-page',
  type: 'Page',
  meta: {
    title: 'Overview Page',
    route: '/account/overview',
  },
  options: {
    rules: [
      {
        layout: 'grid',
      },
    ],
  },
  components: [
    {
      ref: 'account-menu',
    },
    {
      type: 'oryx-composition',
      id: 'overview-content',
      components: [
        {
          type: 'oryx-user-overview',
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
