import { componentDef } from '@spryker-oryx/core';

export * from './attributes.component';
export * from './attributes.model';
export * from './attributes.styles';

export const productAttributesComponent = componentDef({
  name: 'product-attributes',
  impl: () =>
    import('./attributes.component').then((m) => m.ProductAttributesComponent),
});
