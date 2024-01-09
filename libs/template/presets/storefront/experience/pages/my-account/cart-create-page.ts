import { CART_CREATE } from '@spryker-oryx/cart';
import { ExperienceComponent } from '@spryker-oryx/experience';
import { Size } from '@spryker-oryx/utilities';

export const cartCreatePage: ExperienceComponent = {
  id: 'cart-create-page',
  type: 'Page',
  meta: {
    title: 'Create Cart',
    routeType: CART_CREATE,
    route: '/my-account/create-cart',
    description: 'Create Cart Page',
  },
  components: [
    { ref: 'header' },
    {
      type: 'oryx-composition',
      options: { rules: [{ layout: 'list', padding: '30px 0' }] },
      components: [
        {
          type: 'oryx-site-breadcrumb',
          options: {
            rules: [{ query: { breakpoint: Size.Sm }, hide: true }],
          },
        },
        { ref: 'cart-create-page-content' },
      ],
    },
    { ref: 'footer' },
  ],
};
