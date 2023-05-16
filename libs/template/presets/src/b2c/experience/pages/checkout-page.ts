import { DiscountRowsAppearance } from '@spryker-oryx/cart/totals';
import { StaticComponent } from '@spryker-oryx/experience';

export const CheckoutPage: StaticComponent = {
  type: 'Page',
  meta: {
    title: 'Checkout Page',
    route: '/checkout',
    description: 'Checkout Page Description',
  },
  options: {
    data: {
      rules: [
        {
          layout: 'split-main',
          padding: '30px 0 0',
        },
        {
          breakpoint: 'sm',
          gap: '0',
        },
      ],
    },
  },
  components: [
    {
      type: 'experience-composition',
      components: [
        {
          type: 'oryx-checkout',
          components: [
            { type: 'oryx-checkout-customer' },
            { type: 'oryx-checkout-delivery' },
            { type: 'oryx-checkout-shipment' },
            { type: 'oryx-checkout-payment' },
          ],
          options: { data: { rules: [{ layout: 'list' }] } },
        },
        {
          type: 'oryx-cart-entries',
          options: { data: { readonly: true } },
        },
      ],
      options: {
        data: {
          rules: [
            { gap: '20px', layout: 'flex', vertical: true, align: 'stretch' },
          ],
        },
      },
    },
    {
      type: 'experience-composition',
      options: {
        data: {
          rules: [
            {
              gap: '20px',
              sticky: true,
              top: '108px',
            },
          ],
        },
      },
      components: [
        {
          type: 'oryx-cart-totals',
          components: [
            { type: 'oryx-cart-totals-subtotal' },
            {
              type: 'oryx-cart-totals-discount',
              options: {
                data: {
                  discountRowsAppearance: DiscountRowsAppearance.Collapsed,
                },
              },
            },
            { type: 'oryx-cart-totals-expense' },
            { type: 'oryx-cart-totals-tax' },
            { type: 'oryx-cart-totals-delivery' },
            { type: 'oryx-cart-totals-total' },
          ],
        },
        { type: 'oryx-checkout-place-order' },
      ],
    },
  ],
};
