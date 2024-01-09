import { ExperienceComponent } from '@spryker-oryx/experience';
import { Size } from '@spryker-oryx/utilities';

export const merchantPage: ExperienceComponent = {
  id: 'merchant-page',
  type: 'Page',
  meta: {
    title: 'Merchant',
    route: '/merchant/:id',
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
            layout: { type: 'list' },
            padding: '30px 0',
          },
        ],
      },

      components: [
        {
          type: 'oryx-site-breadcrumb',
          options: { rules: [{ query: { breakpoint: Size.Sm }, hide: true }] },
        },
        { ref: 'merchant-page-content' },
      ],
    },
    { ref: 'footer' },
  ],
};
