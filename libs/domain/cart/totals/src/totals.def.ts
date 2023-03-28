import { componentDef } from '@spryker-oryx/core';

export const cartTotalsComponent = componentDef({
  name: 'oryx-cart-totals',
  impl: () => import('./totals.component').then((m) => m.CartTotalsComponent),
  schema: () =>
    import('./totals.schema').then((m) => m.cartTotalsComponentSchema),
  stylesheets: [
    { rules: () => import('./totals.styles').then((m) => m.totalStyles) },
  ],
});

export * from '../components/cart-total.def';
