import { DiscountRowsAppearance } from '@spryker-oryx/cart/totals';
import { ExperienceComponent } from '@spryker-oryx/experience';

export const orderConfirmationPage: ExperienceComponent = {
  id: 'order-confirmation',
  type: 'Page',
  meta: {
    title: 'Order Confirmation Page',
    route: '/order/:id',
    description: 'Order Page Description',
  },
  components: [
    { type: 'oryx-order-confirmation-banner' },
    {
      type: 'oryx-composition',
      options: {
        rules: [{ layout: 'split-main', padding: '30px 0' }],
      },
      components: [
        {
          type: 'oryx-order-summary',
          options: {
            rules: [{ colSpan: 2 }],
          },
        },
        { type: 'oryx-order-entries' },
        {
          type: 'oryx-order-totals',
          components: [
            { type: 'oryx-cart-totals-subtotal' },
            {
              type: 'oryx-cart-totals-discount',
              options: {
                discountRowsAppearance: DiscountRowsAppearance.Collapsed,
              },
            },
            { type: 'oryx-cart-totals-tax' },
            { type: 'oryx-cart-totals-total' },
          ],
        },
      ],
    },
  ],
};
