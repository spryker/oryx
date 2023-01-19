import { componentDef } from '@spryker-oryx/core';
import { CartTotalsComponentOptions } from './totals.model';

declare global {
  interface FeatureOptions {
    'cart-totals'?: CartTotalsComponentOptions;
  }
}

export const cartTotalsComponent = componentDef({
  name: 'cart-totals',
  impl: () => import('./totals.component').then((m) => m.CartTotalsComponent),
});
