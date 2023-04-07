import { componentDef } from '@spryker-oryx/core';
import { ProductIdOptions } from './id.model';

declare global {
  interface FeatureOptions {
    'oryx-product-id'?: ProductIdOptions;
  }
}

export const productIdComponent = componentDef({
  name: 'oryx-product-id',
  impl: () => import('./id.component').then((m) => m.ProductIdComponent),
  schema: () => import('./id.schema').then((m) => m.productIdSchema),
});
