import { componentDef } from '@spryker-oryx/core';
import { ProductTitleOptions } from './title.model';

declare global {
  interface FeatureOptions {
    'oryx-product-title'?: ProductTitleOptions;
  }
}

export const productTitleComponent = componentDef({
  name: 'oryx-product-title',
  impl: () => import('./title.component').then((m) => m.ProductTitleComponent),
  schema: () => import('./title.schema').then((m) => m.productTitleSchema),
});
