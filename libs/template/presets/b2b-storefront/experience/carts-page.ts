import { ExperienceComponent } from '@spryker-oryx/experience';
import { Size } from '@spryker-oryx/utilities';

export const cartsPage: ExperienceComponent = {
  id: 'carts-page',
  type: 'Page',
  meta: {
    title: 'Carts',
    route: '/carts',
    description: 'Carts Page',
  },
  options: {
    rules: [
      { layout: 'split-main', padding: '30px 0' },
      { query: { breakpoint: 'sm' }, gap: '0' },
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
      type: 'oryx-composition',
      components: [{ type: 'oryx-cart-list' }],
      options: { rules: [{ layout: 'list' }] },
    },
  ],
};
