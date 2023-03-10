import { StaticComponent } from '@spryker-oryx/experience';

export const CartPage: StaticComponent = {
  type: 'Page',
  meta: { title: 'Cart Page', route: '/cart' },
  options: {
    data: {
      rules: [{ layout: 'two-column', container: 'true', padding: '30px 0 0' }],
    },
  },
  components: [
    {
      type: 'oryx-cart-entries',
      options: {
        data: {
          defaultExpandedOptions: true,
          removeByQuantity: 'showBin',
          silentRemove: true,
        },
      },
    },
    {
      type: 'experience-composition',
      components: [{ type: 'oryx-cart-totals' }, { type: 'checkout-link' }],
      options: {
        data: {
          rules: [
            {
              sticky: true,
              top: '78px',
              maxWidth: true,
              layout: 'list',
              gap: '20px',
            },
          ],
        },
      },
    },
  ],
};
