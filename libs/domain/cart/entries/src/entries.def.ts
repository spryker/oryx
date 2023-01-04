import { componentDef } from '@spryker-oryx/core';

export const cartEntriesComponent = componentDef({
  name: 'cart-entries',
  impl: () => import('./entries.component').then((m) => m.CartEntriesComponent),
});
