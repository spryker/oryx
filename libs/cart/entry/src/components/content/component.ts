import { componentDef } from '@spryker-oryx/core';

export const cartEntryContentComponent = componentDef({
  name: 'cart-entry-content',
  impl: () =>
    import('./content.component').then((m) => m.CartEntryContentComponent),
});
