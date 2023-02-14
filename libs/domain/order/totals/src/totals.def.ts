import { componentDef } from '@spryker-oryx/core';

export const orderTotalsComponent = componentDef({
  name: 'oryx-order-totals',
  impl: () => import('./totals.component').then((m) => m.OrderTotalsComponent),
  schema: () => import('./totals.schema').then((m) => m.orderTotalsSchema),
});
