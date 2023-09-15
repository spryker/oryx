import { componentDef } from '@spryker-oryx/utilities';

export const pickingNavigateBackComponent = componentDef({
  name: 'oryx-picking-navigate-back',
  impl: () =>
    import('./navigate-back.component').then(
      (m) => m.PickingNavigateBackComponent
    ),
  schema: () =>
    import('./navigate-back.schema').then(
      (m) => m.pickingNavigateBackComponentSchema
    ),
});
