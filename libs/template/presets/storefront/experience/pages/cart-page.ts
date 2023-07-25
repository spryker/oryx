import { ExperienceComponent } from '@spryker-oryx/experience';

export const cartPage: ExperienceComponent = {
  id: 'cart',
  type: 'Page',
  meta: {
    title: 'Cart Page',
    route: '/cart',
    description: 'Cart Page Description',
  },
  options: {
    rules: [
      { layout: 'split-main', padding: '30px 0' },
      { query: { breakpoint: 'sm' }, gap: '0' },
    ],
  },
  components: [
    {
      type: 'oryx-content-text',
      content: {
        data: {
          text: `
          <oryx-icon type="shopping_cart" style="--oryx-icon-size: 40px;"></oryx-icon>
          <p>Your shopping cart is empty</p><oryx-button>
          <a href="/search">Shop now</a></oryx-button>`,
        },
      },
      options: {
        visibility: { hideByRule: 'CART.!EMPTY' },
        rules: [
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
