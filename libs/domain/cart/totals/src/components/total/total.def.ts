import { componentDef } from '@spryker-oryx/utilities';

const rules = () =>
  import('../cart-totals.styles').then((m) => m.cartTotalsStyles);

export const cartTotalsTotalComponent = componentDef({
  name: 'oryx-cart-totals-total',
  impl: () =>
    import('./total.component').then((m) => m.CartTotalsTotalComponent),
  schema: () =>
    import('./total.schema').then((m) => m.cartTotalsTotalComponentSchema),
  stylesheets: [
    { rules },
    {
      rules: () =>
        import('./total.styles').then((m) => m.cartTotalsTotalStyles),
    },
  ],
});
