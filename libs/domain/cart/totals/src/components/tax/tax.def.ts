import { componentDef } from '@spryker-oryx/utilities';

const rules = () =>
  import('../cart-totals.styles').then((m) => m.cartTotalsStyles);

export const cartTotalsTaxComponent = componentDef({
  name: 'oryx-cart-totals-tax',
  impl: () => import('./tax.component').then((m) => m.CartTotalsTaxComponent),
  schema: () =>
    import('./tax.schema').then((m) => m.cartTotalsTaxComponentSchema),
  stylesheets: [{ rules }],
});
