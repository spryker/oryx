import { componentDef } from '@spryker-oryx/core';

export * from './id.component';
export * from './id.model';

export const productIdComponent = componentDef({
  name: 'product-id',
  impl: () => import('./id.component').then((m) => m.ProductIdComponent),
});
