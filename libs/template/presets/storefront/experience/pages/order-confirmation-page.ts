import { ExperienceComponent } from '@spryker-oryx/experience';
import { featureVersion } from '@spryker-oryx/utilities';

export const orderConfirmationPage: ExperienceComponent = {
  id: 'order-confirmation-page',
  type: 'Page',
  meta: {
    title: 'Order Confirmation Page',
    route: '/order/:id',
    description: 'Order Page Description',
  },
  components: [
    featureVersion >= '1.1'
      ? {
          ref: 'header',
        }
      : {},
    {
      type: 'oryx-composition',
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
                { type: 'oryx-cart-totals-total' },
              ],
            },
            { type: 'oryx-order-entries' },
          ],
        },
      ],
    },
    featureVersion >= '1.1'
      ? {
          ref: 'footer',
        }
      : {},
  ],
};
