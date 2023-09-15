import { componentDef } from '@spryker-oryx/utilities';

export const pickingWarehouseAssignmentComponent = componentDef({
  name: 'oryx-picking-warehouse-assignment',
  impl: () =>
    import('./warehouse-assignment.component').then(
      (m) => m.PickingWarehouseAssignmentComponent
    ),
});
