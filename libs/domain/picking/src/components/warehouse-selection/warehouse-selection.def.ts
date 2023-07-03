import { componentDef } from '@spryker-oryx/core';

export const warehouseSelectionComponent = componentDef({
  name: 'oryx-warehouse-selection',
  impl: () =>
    import('./warehouse-selection.component').then(
      (m) => m.WarehouseSelectionComponent
    ),
});
