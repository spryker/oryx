import { componentDef } from '@spryker-oryx/core';

export const productMediaComponent = componentDef({
  name: 'product-media',
  impl: () => import('./media.component').then((m) => m.ProductMediaComponent),
});
