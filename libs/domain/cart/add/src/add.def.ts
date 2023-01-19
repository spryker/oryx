import { componentDef } from '@spryker-oryx/core';
import { CartAddOptions } from './add.model';

declare global {
  interface FeatureOptions {
    'oryx-cart-add'?: CartAddOptions;
  }
}

export const addToCartComponent = componentDef({
  name: 'oryx-cart-add',
  impl: () => import('./add.component').then((m) => m.CartAddComponent),
});
