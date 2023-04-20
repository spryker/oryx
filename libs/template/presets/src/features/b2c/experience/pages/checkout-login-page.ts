import { StaticComponent } from '@spryker-oryx/experience';

export const CheckoutAuthPage: StaticComponent = {
  type: 'Page',
  meta: { title: 'Checkout Login Page', route: '/checkout-login' },
  options: {
    data: {
      rules: [
        {
          container: 'true',
          layout: 'list',
          gap: '30px',
          padding: '30px 0 0',
        },
      ],
    },
  },
  components: [
    {
      type: 'oryx-checkout-guest',
    },
    {
      type: 'oryx-auth-login',
    },
  ],
};
