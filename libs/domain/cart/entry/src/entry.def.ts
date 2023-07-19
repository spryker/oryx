import { componentDef } from '@spryker-oryx/utilities';
import { CartEntryOptions } from './entry.model';

declare global {
  interface FeatureOptions {
    'oryx-cart-entry'?: CartEntryOptions;
  }
}

export const cartEntryComponent = componentDef({
  name: 'oryx-cart-entry',
  impl: () => import('./entry.component').then((m) => m.CartEntryComponent),
  schema: () =>
    import('./entry.schema').then((m) => m.cartEntryComponentSchema),
  stylesheets: [
    {
      rules: () =>
        import('./styles/entry-screen.styles').then(
          (m) => m.cartEntryScreenStyles
        ),
    },
  ],
});
