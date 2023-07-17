import { componentDef } from '@spryker-oryx/core';
import { ProductListOptions } from './list.model';

declare global {
  interface FeatureOptions {
    'product-list'?: ProductListOptions;
  }
}

export const productListComponent = componentDef({
  name: 'oryx-product-list',
  impl: () => import('./list.component').then((m) => m.ProductListComponent),
  schema: () => import('./list.schema').then((m) => m.productListSchema),
});
