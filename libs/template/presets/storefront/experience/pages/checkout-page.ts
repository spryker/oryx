import { DiscountRowsAppearance } from '@spryker-oryx/cart/totals';
import { StaticComponent } from '@spryker-oryx/experience';

export const checkoutPage: StaticComponent = {
  id: 'checkout',
  type: 'Page',
  meta: {
    title: 'Checkout Page',
    route: '/checkout',
    description: 'Checkout Page Description',
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
    {
      type: 'oryx-composition',
      components: [
        {
          type: 'oryx-checkout-orchestrator',
          components: [
            { type: 'oryx-checkout-account' },
            { type: 'oryx-checkout-shipping-address' },
            { type: 'oryx-checkout-billing-address' },
            { type: 'oryx-checkout-shipping-method' },
            { type: 'oryx-checkout-payment-method' },
          ],
          options: { rules: [{ layout: 'list', gap: '30px' }] },
        },
        {
          type: 'oryx-cart-entries',
          options: { readonly: true },
        },
      ],
      options: {
        rules: [
          { gap: '20px', layout: 'flex', vertical: true, align: 'stretch' },
        ],
      },
    },
    {
      type: 'oryx-composition',
      options: {
        rules: [
          {
            sticky: true,
            top: '108px',
          },
        ],
      },
      components: [
        {
          type: 'oryx-cart-totals',
          components: [
            { type: 'oryx-cart-totals-subtotal' },
            {
              type: 'oryx-cart-totals-discount',
              options: {
                discountRowsAppearance: DiscountRowsAppearance.Collapsed,
              },
            },
            { type: 'oryx-cart-totals-tax' },
            { type: 'oryx-cart-totals-delivery' },
            { type: 'oryx-cart-totals-total' },
          ],
        },
        {
          type: 'oryx-content-text',
          content: {
            data: {
              text: '<p>The <a href="/article/terms-and-conditions" target="_blank" data-color="primary">Terms and conditions</a> apply.<br/>Please also see our <a href="/article/privacy" target="_blank"  data-color="primary">Privacy notice</a>.</p>',
            },
          },
        },
        { type: 'oryx-checkout-place-order' },
      ],
    },
  ],
};
