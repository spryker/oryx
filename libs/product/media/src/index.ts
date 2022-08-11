import { componentDef } from '@spryker-oryx/core';

export * from './media.component';
export * from './media.model';

export const productMediaComponent = componentDef({
  name: 'product-media',
  impl: () => import('./media.component').then((m) => m.ProductMediaComponent),
});
