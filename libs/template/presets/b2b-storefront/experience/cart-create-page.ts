import { ExperienceComponent } from '@spryker-oryx/experience';
import { Size } from '@spryker-oryx/utilities';

export const cartCreatePage: ExperienceComponent = {
  id: 'cart-create-page',
  type: 'Page',
  meta: {
    title: 'Create Cart',
    route: '/create-cart',
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
        rules: [{ colSpan: 2 }, { query: { breakpoint: Size.Sm }, hide: true }],
      },
    },
    {
      type: 'oryx-composition',
      components: [{ type: 'oryx-cart-edit' }],
      options: { rules: [{ layout: 'list' }] },
    },
  ],
};
