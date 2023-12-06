import { componentDef } from '@spryker-oryx/utilities';

export const pickingOrderReferenceComponent = componentDef({
  name: 'oryx-picking-order-reference',
  impl: () =>
    import('./order-reference.component').then(
      (m) => m.PickingOrderReferenceComponent
    ),
});
