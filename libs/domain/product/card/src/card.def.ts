import { componentDef } from '@spryker-oryx/core';
import { ComponentSchema } from './card.model';

declare global {
  interface FeatureOptions {
    'product-card'?: ComponentSchema;
  }
}

export const productCardComponent = componentDef({
  name: 'product-card',
  impl: () => import('./card.component').then((m) => m.ProductCardComponent),
  model: () => import('./card.model').then((m) => m.ComponentSchema),
});
