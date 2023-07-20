import { componentDef } from '@spryker-oryx/utilities';

export const orderSummaryComponent = componentDef({
  name: 'oryx-order-summary',
  impl: () =>
    import('./summary.component').then((m) => m.OrderSummaryComponent),
  schema: () => import('./summary.schema').then((m) => m.orderSummarySchema),
  stylesheets: [
    {
      rules: () => import('./summary.styles').then((m) => m.screenStyles),
    },
  ],
});
