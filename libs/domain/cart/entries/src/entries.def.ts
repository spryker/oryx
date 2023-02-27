import { componentDef } from '@spryker-oryx/core';
import { CartEntriesOptions } from './entries.model';

declare global {
  interface FeatureOptions {
    'oryx-cart-entries'?: CartEntriesOptions;
  }
}

export const cartEntriesComponent = componentDef({
  name: 'oryx-cart-entries',
  impl: () => import('./entries.component').then((m) => m.CartEntriesComponent),
});
