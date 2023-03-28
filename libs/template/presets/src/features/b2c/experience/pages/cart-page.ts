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
    { type: 'oryx-cart-entries' },
    {
      type: 'experience-composition',
      components: [
        {
          type: 'experience-composition',
          components: [
            { type: 'oryx-cart-totals-subtotal' },
            { type: 'oryx-cart-totals-discount' },
            { type: 'oryx-cart-totals-expense' },
            { type: 'oryx-cart-totals-tax' },
            { type: 'oryx-cart-totals-delivery' },
            { type: 'oryx-cart-totals-total' },
          ],
          options: {
            data: {
              rules: [
                {
                  sticky: true,
                  top: '108px',
                  padding: '20px 0',
                  layout: 'list',
                  maxWidth: true,
                  gap: '0',
                  radius: '4px',
                  background: 'var(--oryx-color-canvas-200)',
                },
              ],
            },
          },
        },
        { type: 'oryx-cart-totals' },
        { type: 'checkout-link' },
      ],
      options: {
        data: {
          rules: [
            {
              sticky: true,
              top: '108px',
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
