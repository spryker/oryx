import { ExperienceComponent } from '@spryker-oryx/experience';

export const cartDetailsPage: ExperienceComponent = {
  id: 'cart-details-page',
  type: 'Page',
  meta: {
    title: 'Cart Details Page',
    route: '/my-account/carts/:cartId',
    description: 'Cart Details Page Description',
  },
  components: [
    { ref: 'header' },
    {
      type: 'oryx-composition',
      components: [
        {
          type: 'oryx-content-text',
          content: {
            data: {
              text: `
              <oryx-icon type="shopping_cart" style="--oryx-icon-size: 40px;"></oryx-icon>
              <p>Your shopping cart is empty  qw  qw  qw  qw</p><oryx-button>
              <a href="/search">Shop now</a></oryx-button>`,
            },
          },
          options: {
            rules: [
              { hideByRule: 'CORE.SERVER||CART.!EMPTY' },
              {
                colSpan: 2,
                background: 'var(--oryx-color-neutral-3)',
                width: '66%',
                margin: 'auto',
                padding: '20px',
                radius: '4px',
                style: `display: grid;gap:14px;justify-items: center;`,
              },
            ],
          },
        },
        {
          type: 'oryx-composition',
          id: 'cart-details-entries',
          components: [
            { type: 'oryx-cart-heading' },
            { type: 'oryx-cart-entries' },
          ],
          options: { rules: [{ layout: 'list' }] },
        },
        {
          type: 'oryx-composition',
          id: 'cart-details-totals',
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
          ],
          options: {
            rules: [
              {
                layout: { type: 'list', sticky: true },
                top: '108px',
                sticky: true,
              },
            ],
          },
        },
      ],
      options: {
        rules: [
          {
            layout: { type: 'split', columnWidthType: 'main' },
            padding: '30px 0',
          },
          { query: { breakpoint: 'sm' }, gap: '0' },
        ],
      },
    },
    { ref: 'footer' },
  ],
};
