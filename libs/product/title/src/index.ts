import { componentDef } from '@spryker-oryx/core';

export * from './title.component';
export * from './title.styles';

export const productTitleComponent = componentDef({
  name: 'product-title',
  impl: () => import('./title.component').then((m) => m.ProductTitleComponent),
});
