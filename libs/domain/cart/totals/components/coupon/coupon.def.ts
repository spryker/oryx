import { componentDef } from '@spryker-oryx/utilities';

const rules = () =>
  import('../cart-totals.styles').then((m) => m.cartTotalsStyles);

export const cartTotalsCouponComponent = componentDef({
  name: 'oryx-cart-totals-coupon',
  impl: () =>
    import('./coupon.component').then((m) => m.CartTotalsCouponComponent),
  // stylesheets: [{ rules }],
});
