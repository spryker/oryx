import { componentDef } from '@spryker-oryx/core';

export * from './description.component';
export * from './description.styles';
export * from './model';
export * from './utils';

export const productDescriptionComponent = componentDef({
  name: 'product-description',
  impl: () =>
    import('./description.component').then(
      (m) => m.ProductDescriptionComponent
    ),
});
