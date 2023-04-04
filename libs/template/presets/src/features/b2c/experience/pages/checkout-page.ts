import { DiscountRowsAppearance } from '@spryker-oryx/cart/totals';
import { StaticComponent } from '@spryker-oryx/experience';

export const CheckoutPage: StaticComponent = {
  type: 'Page',
  meta: { title: 'Checkout Page', route: '/checkout' },
  options: {
    data: {
      rules: [
        {
          layout: 'two-column',
          container: 'true',
          gap: '30px',
          padding: '30px 0 0',
        },
      ],
    },
  },
  components: [
    {
      type: 'experience-composition',
      components: [
        {
          type: 'oryx-checkout-composition',
        },
        {
          type: 'oryx-cart-entries',
          options: { data: { readonly: true } },
        },
      ],
      options: { data: { rules: [{ gap: '20px', layout: 'list' }] } },
    },
    {
      type: 'experience-composition',
      options: {
        data: {
          rules: [
            {
              align: 'stretch',
              maxWidth: true,
              sticky: true,
              layout: 'list',
              gap: '20px',
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
        { type: 'checkout-place-order' },
      ],
    },
  ],
};
