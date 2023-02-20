import { Component } from '@spryker-oryx/experience';

export const OrderPage: Component<unknown> = {
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
        {
          type: 'experience-composition',
          components: [{ type: 'oryx-order-entries' }],
        },
        {
          type: 'experience-composition',
          components: [{ type: 'oryx-order-totals' }],
          options: {
            data: {
              rules: [
                {
                  align: 'stretch',
                  maxWidth: true,
                  padding: '30px 0',
                  sticky: true,
                  layout: 'list',
                  gap: '20px',
                  top: '68px',
                },
              ],
            },
          },
        },
      ],
    },
  ],
};
