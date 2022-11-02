import { componentDef } from '@spryker-oryx/core';
export { cartEntryConfirmationComponent } from './components/confirmation/confirmation.def';
export { cartEntryContentComponent } from './components/content/content.defs';
export { cartEntryOptionsComponent } from './components/options/options.def';
export { cartEntryPriceComponent } from './components/price/price.def';
export { cartEntryTotalsComponent } from './components/totals/totals.def';

export const cartEntryComponent = componentDef({
  name: 'cart-entry',
  impl: () => import('./entry.component').then((m) => m.CartEntryComponent),
});
