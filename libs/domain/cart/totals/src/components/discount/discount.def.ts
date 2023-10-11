import { componentDef } from '@spryker-oryx/utilities';

const rules = () =>
  import('../cart-totals.styles').then((m) => m.cartTotalsStyles);

export const cartTotalsDiscountComponent = componentDef({
  name: 'oryx-cart-totals-discount',
  impl: () =>
    import('./discount.component').then((m) => m.CartTotalsDiscountComponent),
  schema: () =>
    import('./discount.schema').then(
      (m) => m.cartTotalsDiscountComponentSchema
    ),
  stylesheets: [
    { rules },
    {
      rules: () =>
        import('./discount.styles').then((m) => m.cartTotalsDiscountStyles),
    },
  ],
});
