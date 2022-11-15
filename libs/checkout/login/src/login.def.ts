import { componentDef } from '@spryker-oryx/core';

export const checkoutLoginComponent = componentDef({
  name: 'checkout-login',
  impl: () => import('./login.component').then((m) => m.CheckoutLoginComponent),
  stylesheets: [
    {
      rules: () =>
        import('@spryker-oryx/experience/composition').then(
          (m) => m.layoutScreenStyles
        ),
    },
  ],
});
