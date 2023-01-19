import { componentDef } from '@spryker-oryx/core';
import { CartEntriesOptions } from './entries.model';

declare global {
  interface Flags {
    'cart-entries'?: CartEntriesOptions;
  }
}

export const cartEntriesComponent = componentDef({
  name: 'cart-entries',
  impl: () => import('./entries.component').then((m) => m.CartEntriesComponent),
});
