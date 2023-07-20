import { componentDef } from '@spryker-oryx/utilities';

export const priceComponent = componentDef({
  name: 'oryx-site-price',
  impl: () => import('./price.component').then((m) => m.PriceComponent),
  schema: import('./price.schema').then((m) => m.sitePriceSchema),
});
