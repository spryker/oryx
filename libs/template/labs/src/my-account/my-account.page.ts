import { ExperienceComponent } from '@spryker-oryx/experience';
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
      ],
    },
    { ref: 'footer' },
  ],
};
