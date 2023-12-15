import { ExperienceComponent } from '@spryker-oryx/experience';
import { HeadingTag } from '@spryker-oryx/ui/heading';
import { Size } from '@spryker-oryx/utilities';

export const merchantPage: ExperienceComponent = {
  id: 'merchant-page',
  type: 'Page',
  meta: {
    title: 'Merchant',
    route: '/merchant/:merchant',
    routeType: 'merchant',
    description: 'Default Merchant Page Description',
  },
  components: [
    { ref: 'header' },

    {
      type: 'oryx-composition',

      options: {
        rules: [
          {
            layout: { type: 'split', columnWidthType: 'main' },
            padding: '30px 0',
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

        {
          type: 'oryx-merchant-banner',
          options: {
            rules: [{ colSpan: 2, height: '250px' }],
          },
        },

        {
          type: 'oryx-composition',
          components: [
            {
              type: 'oryx-merchant-title',
              options: {
                rules: [{ typography: HeadingTag.H1 }],
                prefix: null,
                link: false,
              },
            },
            { type: 'oryx-merchant-legal' },
            { type: 'oryx-merchant-description' },
          ],
          options: {
            rules: [{ layout: 'list' }],
          },
        },

        {
          type: 'oryx-composition',
          components: [
            {
              type: 'oryx-merchant-logo',
              options: { rules: [{ width: '100px' }] },
            },
            { type: 'oryx-merchant-openings-hours' },
            { type: 'oryx-merchant-contact' },
          ],
          options: {
            rules: [{ layout: 'list' }],
          },
        },
      ],
    },

    { ref: 'footer' },
  ],
};
