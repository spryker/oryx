import { StaticComponent } from '@spryker-oryx/experience';
import { TotalsItem } from '@spryker-oryx/order/totals-item';
import { PricesBehavior } from '@spryker-oryx/site';

export const orderPage: StaticComponent = {
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
        data: { rules: [{ layout: 'split-column', splitColumnFactor: 2 / 3 }] },
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
          type: 'oryx-order-totals',
          components: [
            {
              type: 'oryx-order-totals-item',
              options: { data: { type: TotalsItem.Subtotal } },
            },
            {
              type: 'oryx-order-totals-item',
              options: {
                data: {
                  type: TotalsItem.Discount,
                  discountRowsAppearance: PricesBehavior.Collapsed,
                },
              },
            },
            {
              type: 'oryx-order-totals-item',
              options: { data: { type: TotalsItem.Expense } },
            },
            {
              type: 'oryx-order-totals-item',
              options: { data: { type: TotalsItem.Tax } },
            },
            {
              type: 'oryx-order-totals-item',
              options: { data: { type: TotalsItem.Delivery } },
            },
            {
              type: 'oryx-order-totals-item',
              options: {
                data: { type: TotalsItem.Total, enableTaxMessage: true },
              },
            },
          ],
        },
      ],
    },
  ],
};
