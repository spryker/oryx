import { componentDef } from '@spryker-oryx/core';
import { CartEntryOptions } from './entry.model';
export { cartEntryConfirmationComponent } from './components/confirmation/confirmation.def';
export { cartEntryContentComponent } from './components/content/content.defs';
export { cartEntryOptionsComponent } from './components/options/options.def';
export { cartEntryPriceComponent } from './components/price/price.def';
export { cartEntryTotalsComponent } from './components/totals/totals.def';

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
