import { componentDef } from '@spryker-oryx/core';
import { ProductPriceOptions } from './price.model';

declare global {
  interface Flags {
    'product-price'?: ProductPriceOptions;
  }
}

export const productPriceComponent = componentDef({
  name: 'product-price',
  impl: () => import('./price.component').then((m) => m.ProductPriceComponent),
});
