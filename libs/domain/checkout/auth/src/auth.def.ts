import { componentDef } from '@spryker-oryx/core';

export const checkoutAuthComponent = componentDef({
  name: 'checkout-auth',
  impl: () => import('./auth.component').then((m) => m.CheckoutAuthComponent),
  stylesheets: [
    {
      rules: () =>
        import('@spryker-oryx/experience/composition').then(
          (m) => m.layoutScreenStyles
        ),
    },
  ],
});
