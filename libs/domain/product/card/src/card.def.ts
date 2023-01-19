import { componentDef } from '@spryker-oryx/core';
import { ProductCardComponentOptions } from './card.model';

declare global {
  interface FeatureOptions {
    'product-card'?: ProductCardComponentOptions;
  }
}

export const productCardComponent = componentDef({
  name: 'product-card',
  impl: () => import('./card.component').then((m) => m.ProductCardComponent),
});
