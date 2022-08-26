import { componentDef } from '@spryker-oryx/core';
import { cartEntryConfirmationComponent } from './components/confirmation/component';
import { cartEntryContentComponent } from './components/content/component';
import { cartEntryOptionsComponent } from './components/options/component';
import { cartEntryPriceComponent } from './components/price/component';
import { cartEntryTotalsComponent } from './components/totals/component';

export const cartEntryComponent = componentDef({
  name: 'cart-entry',
  impl: () => import('./entry.component').then((m) => m.CartEntryComponent),
});

export const cartEntryComponents = [
  cartEntryComponent,
  cartEntryPriceComponent,
  cartEntryConfirmationComponent,
  cartEntryContentComponent,
  cartEntryOptionsComponent,
  cartEntryTotalsComponent,
];
