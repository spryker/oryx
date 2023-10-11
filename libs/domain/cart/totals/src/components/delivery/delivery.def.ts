import { componentDef } from '@spryker-oryx/utilities';

const rules = () =>
  import('../cart-totals.styles').then((m) => m.cartTotalsStyles);

export const cartTotalsDeliveryComponent = componentDef({
  name: 'oryx-cart-totals-delivery',
  impl: () =>
    import('./delivery.component').then((m) => m.CartTotalsDeliveryComponent),
  schema: () =>
    import('./delivery.schema').then(
      (m) => m.cartTotalsDeliveryComponentSchema
    ),
  stylesheets: [
    { rules },
    {
      rules: () =>
        import('./delivery.styles').then((m) => m.cartDeliveryTotalStyles),
    },
  ],
});
