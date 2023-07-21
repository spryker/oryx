import { StaticComponent } from '@spryker-oryx/experience';

export const cartPage: StaticComponent = {
  id: 'cart',
  type: 'Page',
  meta: {
    title: 'Cart Page',
    route: '/cart',
    description: 'Cart Page Description',
  },
  options: {
    rules: [
      {
        layout: 'split-main',
        padding: '30px 0',
      },
      { query: { breakpoint: 'sm' }, gap: '0' },
    ],
  },
  components: [
    { type: 'oryx-cart-entries' },
    {
      type: 'oryx-composition',
      components: [
        {
          type: 'oryx-cart-totals',
          components: [
            { type: 'oryx-cart-totals-subtotal' },
            { type: 'oryx-cart-totals-discount' },
            { type: 'oryx-cart-totals-tax' },
            { type: 'oryx-cart-totals-delivery' },
            { type: 'oryx-cart-totals-total' },
          ],
        },
        { type: 'oryx-checkout-link' },
      ],
      options: { rules: [{ sticky: true, top: '108px' }] },
    },
  ],
};
