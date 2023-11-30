import { ExperienceComponent } from '@spryker-oryx/experience';
import { Size } from '@spryker-oryx/utilities';

export const cartCreatePage: ExperienceComponent = {
  id: 'cart-create-page',
  type: 'Page',
  meta: {
    title: 'Create Cart',
    route: '/create-cart',
  },
  components: [
    {
      ref: 'header',
    },
    {
      type: 'oryx-composition',
      components: [
        {
          type: 'oryx-site-breadcrumb',
          options: {
            rules: [
              { colSpan: 2 },
              { query: { breakpoint: Size.Sm }, hide: true },
              { padding: '30px 0 0' },
            ],
          },
        },
        { type: 'oryx-cart-edit' },
      ],
      options: { rules: [{ layout: 'list' }] },
    },
  ],
};
