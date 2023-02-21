import { StaticComponent } from '@spryker-oryx/experience';

export const CheckoutPage: StaticComponent = {
  type: 'Page',
  meta: { title: 'Checkout Page', route: '/checkout' },
  components: [
    {
      type: 'experience-composition',
      options: {
        data: {
          rules: [
            { container: true, layout: 'two-column' },
            { breakpoint: 'md', layout: 'column', gap: '30px' },
          ],
        },
      },
      components: [
        {
          type: 'experience-composition',
          options: {
            data: { rules: [{ padding: '30px 0', layout: 'list', gap: '20' }] },
          },
          components: [
            {
              type: 'cart-entries',
              options: {
                data: {
                  collapsible: true,
                  readonly: true,
                  defaultExpandedOptions: false,
                  expanded: false,
                },
              },
            },
            { type: 'oryx-checkout-composition' },
          ],
        },
        {
          type: 'experience-composition',
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
          components: [
            { type: 'cart-totals' },
            { type: 'checkout-place-order' },
          ],
        },
      ],
    },
  ],
};
