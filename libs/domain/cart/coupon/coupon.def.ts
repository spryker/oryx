import { componentDef } from '@spryker-oryx/utilities';

export const couponComponent = componentDef({
  name: 'oryx-cart-coupon',
  impl: () => import('./coupon.component').then((m) => m.CouponComponent),
});
