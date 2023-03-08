import { componentDef } from '@spryker-oryx/core';
import { CartEntryRemoveOptions } from './remove-entry.model';

declare global {
  interface FeatureOptions {
    'oryx-cart-entry-remove'?: CartEntryRemoveOptions;
  }
}

export const cartEntryRemoveComponent = componentDef({
  name: 'oryx-cart-entry-remove',
  impl: () =>
    import('./remove-entry.component').then((m) => m.CartEntryRemoveComponent),
  schema: () =>
    import('./remove-entry.schema').then(
      (m) => m.cartEntryRemoveComponentSchema
    ),
});
