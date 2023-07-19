import { componentDef } from '@spryker-oryx/utilities';

export const orderTotalsComponent = componentDef({
  name: 'oryx-order-totals',
  impl: () => import('./totals.component').then((m) => m.OrderTotalsComponent),
  schema: () =>
    import('./totals.schema').then((m) => m.orderTotalsComponentSchema),
  stylesheets: [
    { rules: () => import('./totals.styles').then((m) => m.orderTotalStyles) },
  ],
});
