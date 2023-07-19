import { componentDef } from '@spryker-oryx/utilities';

export const cartTotalsSubtotalComponent = componentDef({
  name: 'oryx-cart-totals-subtotal',
  impl: () =>
    import('./subtotal.component').then((m) => m.CartTotalsSubtotalComponent),
  schema: () =>
    import('./subtotal.schema').then(
      (m) => m.cartTotalsSubtotalComponentSchema
    ),
  stylesheets: [
    {
      rules: () =>
        import('../cart-totals.styles').then((m) => m.cartTotalsStyles),
    },
  ],
});
