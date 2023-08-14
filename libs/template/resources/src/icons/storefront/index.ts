import { IconMapper } from '@spryker-oryx/experience';
import { IconTypes } from '@spryker-oryx/ui/icon';

export const storefrontIcons: IconMapper = {
  svg: true,
  mapping: {
    [IconTypes.CartAdd]: () =>
      import('./icons/cart-add').then((s) => s.default),
    [IconTypes.Cart]: () => import('./icons/cart').then((s) => s.default),
    [IconTypes.Loader]: () => import('./icons/loader').then((s) => s.default),
    [IconTypes.Drag]: () => import('./icons/drag').then((s) => s.default),
    [IconTypes.DragSmall]: () =>
      import('./icons/drag-small').then((s) => s.default),
    [IconTypes.Actions]: () => import('./icons/actions').then((s) => s.default),
    [IconTypes.ActionsHorizontal]: () =>
      import('./icons/actions-horizontal').then((s) => s.default),
    [IconTypes.Products]: () =>
      import('./icons/products').then((s) => s.default),
    [IconTypes.Front]: () => import('./icons/front').then((s) => s.default),
    [IconTypes.Reset]: () => import('./icons/reset').then((s) => s.default),
    [IconTypes.OrdersHistory]: () =>
      import('./icons/orders-history').then((s) => s.default),
  },
};
