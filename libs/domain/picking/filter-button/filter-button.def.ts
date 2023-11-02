import { componentDef } from '@spryker-oryx/utilities';

export const pickingFilterButtonComponent = componentDef({
  name: 'oryx-picking-filter-button',
  impl: () =>
    import('./filter-button.component').then(
      (m) => m.PickingFilterButtonComponent
    ),
  schema: () =>
    import('./filter-button.schema').then(
      (m) => m.pickingFilterButtonComponentSchema
    ),
});
