import { componentDef } from '@spryker-oryx/utilities';

export const cartSummaryComponent = componentDef({
  name: 'oryx-cart-summary',
  impl: () => import('./summary.component').then((m) => m.CartSummaryComponent),
});
