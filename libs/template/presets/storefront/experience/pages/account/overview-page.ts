import { ExperienceComponent } from '@spryker-oryx/experience';
import { i18n } from '@spryker-oryx/utilities';

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
        padding: '20px 0 0',
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
          type: 'oryx-content-text',
          content: {
            data: {
              text: i18n('user.overview'),
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
