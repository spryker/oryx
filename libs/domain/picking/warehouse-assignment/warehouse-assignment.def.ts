import { componentDef } from '@spryker-oryx/utilities';

export const warehouseAssignmentComponent = componentDef({
  name: 'oryx-warehouse-assignment',
  impl: () =>
    import('./warehouse-assignment.component').then(
      (m) => m.WarehouseAssignmentComponent
    ),
});
