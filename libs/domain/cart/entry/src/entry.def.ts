import { componentDef } from '@spryker-oryx/core';
import { CartEntryOptions } from './entry.model';

declare global {
  interface FeatureOptions {
    'cart-entry'?: CartEntryOptions;
  }
}

export const cartEntryComponent = componentDef({
  name: 'cart-entry',
  impl: () => import('./entry.component').then((m) => m.CartEntryComponent),
  stylesheets: [
    {
      rules: () =>
        import('./styles/entry-screen.styles').then(
          (m) => m.cartEntryScreenStyles
        ),
    },
  ],
});
