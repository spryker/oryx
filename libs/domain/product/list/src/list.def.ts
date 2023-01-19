import { componentDef } from '@spryker-oryx/core';
import { ProductListQualifier } from '@spryker-oryx/product';

declare global {
  interface FeatureOptions {
    'product-list'?: ProductListQualifier;
  }
}

export const productListComponent = componentDef({
  name: 'product-list',
  impl: () => import('./list.component').then((m) => m.ProductListComponent),
  stylesheets: [
    {
      rules: () => import('./list.styles').then((m) => m.screenStyles),
    },
  ],
});
