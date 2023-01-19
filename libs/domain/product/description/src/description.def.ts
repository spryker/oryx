import { componentDef } from '@spryker-oryx/core';
import { ProductDescriptionOptions } from './description.model';

declare global {
  interface Flags {
    'product-description'?: ProductDescriptionOptions;
  }
}

export const productDescriptionComponent = componentDef({
  name: 'product-description',
  impl: () =>
    import('./description.component').then(
      (m) => m.ProductDescriptionComponent
    ),
});
