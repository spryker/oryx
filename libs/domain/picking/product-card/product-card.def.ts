import { componentDef } from '@spryker-oryx/utilities';

export const pickingProductCardComponent = componentDef({
  name: 'oryx-picking-product-card',
  impl: () =>
    import('./product-card.component').then((m) => m.PickingProductCardComponent),
  schema: () =>
    import('./product-card.schema').then((m) => m.pickingProductCardComponentSchema),
});
