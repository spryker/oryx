import { componentDef } from '@spryker-oryx/core';

export const orderTotalsItemComponent = componentDef({
  name: 'oryx-order-totals-item',
  impl: () => import('./totals-item.component').then((m) => m.OrderTotalsItemComponent),
  schema: () => import('./totals-item.schema').then((m) => m.orderTotalsItemSchema),
});
