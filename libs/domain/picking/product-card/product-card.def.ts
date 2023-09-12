import { componentDef } from '@spryker-oryx/utilities';

export const productCardComponent = componentDef({
  name: 'oryx-picking-product-card',
  impl: () =>
    import('./product-card.component').then((m) => m.ProductCardComponent),
  schema: () =>
    import('./product-card.schema').then((m) => m.productCardComponentSchema),
});
