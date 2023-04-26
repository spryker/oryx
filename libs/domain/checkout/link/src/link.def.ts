import { componentDef } from '@spryker-oryx/core';
import { checkoutLinkScreenStyles } from './link.styles';

export const checkoutLinkComponent = componentDef({
  name: 'oryx-checkout-link',
  impl: () => import('./link.component').then((m) => m.CheckoutLinkComponent),
  stylesheets: [{ rules: checkoutLinkScreenStyles }],
});
