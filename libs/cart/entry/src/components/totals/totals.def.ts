import { componentDef } from '@spryker-oryx/core';

export const cartEntryTotalsComponent = componentDef({
  name: 'cart-entry-totals',
  impl: () =>
    import('./totals.component').then((m) => m.CartEntryTotalsComponent),
});
