import { ExperienceComponent } from '@spryker-oryx/experience';

export const orderConfirmationPage: ExperienceComponent = {
  id: 'order-confirmation-page',
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
      id: 'order-totals',
      options: { rules: [{ layout: 'split-main', padding: '30px 0 0' }] },
      components: [
        {
          type: 'oryx-order-summary',
        },
        {
          type: 'oryx-order-totals',
          options: {
            rules: [{ hideByRule: 'USER.!AUTHENTICATED' }],
          },
          components: [
            { type: 'oryx-cart-totals-subtotal' },
            { type: 'oryx-cart-totals-discount' },
            { type: 'oryx-cart-totals-tax' },
            { type: 'oryx-cart-totals-delivery' },
            { type: 'oryx-cart-totals-total' },
          ],
        },
        { type: 'oryx-order-entries' },
      ],
    },
  ],
};
