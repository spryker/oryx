import { componentDef } from '@spryker-oryx/utilities';

const rules = () =>
  import('../cart-totals.styles').then((m) => m.cartTotalsStyles);

export const cartTotalsExpenseComponent = componentDef({
  name: 'oryx-cart-totals-expense',
  impl: () =>
    import('./expense.component').then((m) => m.CartTotalsExpenseComponent),
  schema: () =>
    import('./expense.schema').then((m) => m.cartTotalsExpenseComponentSchema),
  stylesheets: [{ rules }],
});
