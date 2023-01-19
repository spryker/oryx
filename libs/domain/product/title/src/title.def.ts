import { componentDef } from '@spryker-oryx/core';
import { ProductTitleOptions } from './title.model';

declare global {
  interface Flags {
    'product-title'?: ProductTitleOptions;
  }
}

export const productTitleComponent = componentDef({
  name: 'product-title',
  impl: () => import('./title.component').then((m) => m.ProductTitleComponent),
});
