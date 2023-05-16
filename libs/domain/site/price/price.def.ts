import { componentDef } from '@spryker-oryx/core';

export const priceComponent = componentDef({
  name: 'oryx-site-price',
  impl: () => import('./price.component').then((m) => m.PriceComponent),
});
