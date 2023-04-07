import { componentDef } from '@spryker-oryx/core';

export const priceComponent = componentDef({
  name: 'oryx-price',
  impl: () => import('./price.component').then((m) => m.PriceComponent),
});
