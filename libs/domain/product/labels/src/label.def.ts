import { componentDef } from '@spryker-oryx/core';
import { ProductLabelsAttributes } from './label.model';

declare global {
  interface FeatureOptions {
    'product-labels'?: ProductLabelsAttributes;
  }
}

export const productLabelsComponent = componentDef({
  name: 'product-labels',
  impl: () => import('./label.component').then((m) => m.ProductLabelsComponent),
});
