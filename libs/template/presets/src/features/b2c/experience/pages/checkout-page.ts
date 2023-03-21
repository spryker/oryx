import { StaticComponent } from '@spryker-oryx/experience';

export const CheckoutPage: StaticComponent = {
  type: 'Page',
  meta: { title: 'Checkout Page', route: '/checkout' },
  options: {
    data: {
      rules: [
        {
          layout: 'two-column',
          container: 'true',
          gap: '30px',
          padding: '30px 0 0',
        },
      ],
    },
  },
  components: [
    {
      type: 'experience-composition',
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
        {
          type: 'oryx-checkout-composition',
        },
      ],
      options: { data: { rules: [{ gap: '20px', layout: 'list' }] } },
    },
    {
      type: 'experience-composition',
      options: {
        data: {
          rules: [
            {
              align: 'stretch',
              maxWidth: true,
              sticky: true,
              layout: 'list',
              gap: '20px',
              top: '108px',
            },
          ],
        },
      },
      components: [{ type: 'cart-totals' }, { type: 'checkout-place-order' }],
    },
  ],
};
