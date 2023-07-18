import { componentDef } from '@spryker-oryx/utilities';

export const pickingProductCardComponent = componentDef({
  name: 'oryx-picking-product-card',
  impl: () =>
    import('./picking-product-card.component').then(
      (m) => m.PickingProductCardComponent
    ),
  schema: () =>
    import('./picking-product-card.schema').then(
      (m) => m.pickingProductCardComponentSchema
    ),
});
