import { componentDef } from '@spryker-oryx/core';

export * from './price.component';
export * from './price.controller';
export * from './price.model';
export * from './price.styles';

export const productPriceComponent = componentDef({
  name: 'product-price',
  impl: () => import('./price.component').then((m) => m.ProductPriceComponent),
});
