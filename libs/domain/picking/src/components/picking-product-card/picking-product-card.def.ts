import { componentDef } from '@spryker-oryx/core';

export const pickingProductCardComponent = componentDef({
  name: 'oryx-picking-product-card',
  impl: () =>
    import('./picking-product-card.component').then(
      (m) => m.PickingProductCardComponent
    ),
  schema: () =>
    import('./picking-product-card.component').then(
      (m) => m.PickingProductCardComponent
    ),
});
