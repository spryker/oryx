import { componentDef } from '@spryker-oryx/core';
import { ProductIdOptions } from './id.model';

declare global {
  interface Flags {
    'product-id'?: ProductIdOptions;
  }
}

export const productIdComponent = componentDef({
  name: 'product-id',
  impl: () => import('./id.component').then((m) => m.ProductIdComponent),
});
