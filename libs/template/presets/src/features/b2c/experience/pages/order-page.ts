import { DiscountRowsAppearance } from '@spryker-oryx/cart/totals';
import { StaticComponent } from '@spryker-oryx/experience';

export const OrderPage: StaticComponent = {
  type: 'Page',
  meta: {
    title: 'Order Confirmation Page',
    route: '/order/:id',
    description: 'Order Page Description',
  },
  components: [
    { type: 'oryx-order-confirmation-banner' },
    {
      type: 'experience-composition',
      options: {
        data: { rules: [{ layout: 'split-column', splitColumnFactor: 0.66 }] },
      },
      components: [
        {
          type: 'oryx-order-summary',
          options: {
            data: { rules: [{ colSpan: 2 }] },
          },
        },
        { type: 'oryx-order-entries' },
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
      ],
    },
  ],
};
