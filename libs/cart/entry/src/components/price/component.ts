import { componentDef } from '@spryker-oryx/core';

export const cartEntryPriceComponent = componentDef({
  name: 'cart-entry-price',
  impl: () =>
    import('./price.component').then((m) => m.CartEntryPriceComponent),
});
