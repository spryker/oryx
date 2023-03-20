import { StaticComponent } from '@spryker-oryx/experience';

export const OrderPage: StaticComponent = {
  type: 'Page',
  meta: { title: 'Order Confirmation Page', route: '/order/:id' },
  components: [
    { type: 'oryx-order-confirmation-banner' },
    {
      type: 'experience-composition',
      components: [{ type: 'oryx-order-summary' }],
      options: { data: { rules: [{ container: true }] } },
    },
    {
      type: 'experience-composition',
      options: { data: { rules: [{ container: true, layout: 'two-column' }] } },
      components: [
        { type: 'oryx-order-entries' },
        {
          type: 'oryx-order-totals',
          options: { data: { rules: [{ maxWidth: true }] } },
        },
      ],
    },
  ],
};
