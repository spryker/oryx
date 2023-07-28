import { ExperienceComponent } from '@spryker-oryx/experience';

export const orderConfirmationPage: ExperienceComponent = {
  id: 'order-confirmation',
  type: 'Page',
  meta: {
    title: 'Order Confirmation Page',
    route: '/order/:id',
    description: 'Order Page Description',
  },
  options: {
    rules: [{ layout: 'split-main', padding: '30px 0' }],
  },
  components: [
    {
      type: 'oryx-order-summary',
    },
    {
      type: 'oryx-order-totals',
      components: [
        { type: 'oryx-cart-totals-subtotal' },
        { type: 'oryx-cart-totals-discount' },
        { type: 'oryx-cart-totals-tax' },
        { type: 'oryx-cart-totals-total' },
      ],
    },
    {
      type: 'oryx-order-entries',
      options: { rules: [{ colSpan: 2 }] },
    },
  ],
};
