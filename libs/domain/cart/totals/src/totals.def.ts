import { componentDef } from '@spryker-oryx/core';
import { CartTotalsComponentOptions } from './totals.model';

declare global {
  interface FeatureOptions {
    'oryx-cart-totals'?: CartTotalsComponentOptions;
  }
}

export const cartTotalsComponent = componentDef({
  name: 'oryx-cart-totals',
  impl: () => import('./totals.component').then((m) => m.CartTotalsComponent),
  schema: () =>
    import('./totals.schema').then((m) => m.cartTotalsComponentSchema),
});
