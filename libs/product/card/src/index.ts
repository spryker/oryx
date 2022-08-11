import { componentDef } from '@spryker-oryx/core';

export * from './card.component';
export * from './card.model';
export * from './card.styles';

export const productCardComponent = componentDef({
  name: 'product-card',
  impl: () => import('./card.component').then((m) => m.ProductCardComponent),
});
