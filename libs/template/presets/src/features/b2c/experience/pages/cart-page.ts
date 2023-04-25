import { StaticComponent } from '@spryker-oryx/experience';

export const CartPage: StaticComponent = {
  type: 'Page',
  meta: {
    title: 'Cart Page',
    route: '/cart',
    description: 'Cart Page Description',
  },
  options: {
    data: {
      rules: [
        {
          layout: 'split-column',
          splitColumnFactor: 0.66,
          padding: '30px 0 0',
        },
        { breakpoint: 'sm', gap: '0' },
      ],
    },
  },
  components: [
    { type: 'oryx-cart-entries' },
    {
      type: 'experience-composition',
      components: [
        {
          type: 'oryx-cart-totals',
          components: [
            { type: 'oryx-cart-totals-subtotal' },
            { type: 'oryx-cart-totals-discount' },
            { type: 'oryx-cart-totals-expense' },
            { type: 'oryx-cart-totals-tax' },
            { type: 'oryx-cart-totals-delivery' },
            { type: 'oryx-cart-totals-total' },
          ],
        },
        { type: 'checkout-link' },
      ],
      options: {
        data: {
          rules: [
            {
              layout: 'list',
              gap: '20px',
              sticky: true,
              top: '108px',
            },
          ],
        },
      },
    },
  ],
};
