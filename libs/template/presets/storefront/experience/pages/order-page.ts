import { StaticComponent } from '@spryker-oryx/experience';
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
          type: 'oryx-site-totals',
          options: { data: { renderIf: 'ORDER.HAS_TOTALS' } },
          components: [
            {
              type: 'oryx-site-totals-item',
              options: { data: { type: 'ORDER.SUBTOTAL' } },
            },
            {
              type: 'oryx-site-totals-item',
              options: {
                data: {
                  type: 'ORDER.DISCOUNT',
                  discountRowsAppearance: PricesBehavior.Collapsed,
                },
              },
            },
            {
              type: 'oryx-site-totals-item',
              options: { data: { type: 'ORDER.EXPENSE' } },
            },
            {
              type: 'oryx-site-totals-item',
              options: { data: { type: 'ORDER.TAX' } },
            },
            {
              type: 'oryx-site-totals-item',
              options: { data: { type: 'ORDER.DELIVERY' } },
            },
            {
              type: 'oryx-site-totals-item',
              options: {
                data: { type: 'ORDER.TOTAL', enableTaxMessage: true },
              },
            },
          ],
        },
      ],
    },
  ],
};
