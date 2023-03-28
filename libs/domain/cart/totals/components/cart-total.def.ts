import { componentDef } from '@spryker-oryx/core';

const stylesheets = [
  {
    rules: () =>
      import('./screen.styles').then((m) => m.cartTotalsScreenStyles),
  },
];

export const cartTotalsSubtotalComponent = componentDef({
  name: 'oryx-cart-totals-subtotal',
  impl: () =>
    import('./cart-total.component').then((m) => m.CartTotalsSubtotalComponent),
  schema: () =>
    import('./cart-total.schema').then(
      (m) => m.cartTotalsSubtotalComponentSchema
    ),
  stylesheets,
});

export const cartTotalsDiscountComponent = componentDef({
  name: 'oryx-cart-totals-discount',
  impl: () =>
    import('./cart-total.component').then((m) => m.CartTotalsDiscountComponent),
  schema: () =>
    import('./cart-total.schema').then(
      (m) => m.cartTotalsDiscountComponentSchema
    ),
  stylesheets: [
    {
      rules: () =>
        import('./screen.styles').then((m) => m.cartTotalsDiscountScreenStyles),
    },
  ],
});

export const cartTotalsExpenseComponent = componentDef({
  name: 'oryx-cart-totals-expense',
  impl: () =>
    import('./cart-total.component').then((m) => m.CartTotalsExpenseComponent),
  schema: () =>
    import('./cart-total.schema').then(
      (m) => m.cartTotalsExpenseComponentSchema
    ),
  stylesheets,
});

export const cartTotalsTaxComponent = componentDef({
  name: 'oryx-cart-totals-tax',
  impl: () =>
    import('./cart-total.component').then((m) => m.CartTotalsTaxComponent),
  schema: () =>
    import('./cart-total.schema').then((m) => m.cartTotalsTaxComponentSchema),
  stylesheets,
});

export const cartTotalsDeliveryComponent = componentDef({
  name: 'oryx-cart-totals-delivery',
  impl: () =>
    import('./cart-total.component').then((m) => m.CartTotalsDeliveryComponent),
  schema: () =>
    import('./cart-total.schema').then(
      (m) => m.cartTotalsDeliveryComponentSchema
    ),
  stylesheets,
});

export const cartTotalsTotalComponent = componentDef({
  name: 'oryx-cart-totals-total',
  impl: () =>
    import('./cart-total.component').then((m) => m.CartTotalsTotalComponent),
  schema: () =>
    import('./cart-total.schema').then((m) => m.cartTotalsTotalComponentSchema),
  stylesheets: [
    {
      rules: () =>
        import('./screen.styles').then((m) => m.cartTotalsTotalScreenStyles),
    },
  ],
});
