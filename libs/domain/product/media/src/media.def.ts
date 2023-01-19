import { componentDef } from '@spryker-oryx/core';
import { ProductMediaOptions } from './media.model';

declare global {
  interface Flags {
    'product-media'?: ProductMediaOptions;
  }
}

export const productMediaComponent = componentDef({
  name: 'product-media',
  impl: () => import('./media.component').then((m) => m.ProductMediaComponent),
});
