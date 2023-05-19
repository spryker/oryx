import { ResourceIcons } from '@spryker-oryx/experience';
import { IconTypes } from '../icon.model';

export const backofficeIcons: ResourceIcons = {
  [IconTypes.CartAdd]: () => import('./icons/cart-add').then((s) => s.default),
  [IconTypes.Cart]: () => import('./icons/cart').then((s) => s.default),
  [IconTypes.Image]: () => import('./icons/image').then((s) => s.default),
  [IconTypes.Info]: () => import('./icons/info').then((s) => s.default),
  [IconTypes.Error]: () => import('./icons/input-error').then((s) => s.default),
  [IconTypes.InputError]: () =>
    import('./icons/input-error').then((s) => s.default), // merge with error
  [IconTypes.Remove]: () => import('./icons/remove').then((s) => s.default),
  [IconTypes.Rocket]: () => import('./icons/rocket').then((s) => s.default),
  [IconTypes.Trash]: () => import('./icons/trash').then((s) => s.default),
  [IconTypes.Loader]: () => import('./icons/loader').then((s) => s.default),
  [IconTypes.Visible]: () => import('./icons/visible').then((s) => s.default),
  [IconTypes.Invisible]: () =>
    import('./icons/invisible').then((s) => s.default),
  [IconTypes.Wishlist]: () => import('./icons/wishlist').then((s) => s.default),
  [IconTypes.Ratings]: () => import('./icons/ratings').then((s) => s.default),
  [IconTypes.Orders]: () => import('./icons/orders').then((s) => s.default),
  [IconTypes.Products]: () => import('./icons/products').then((s) => s.default),
  [IconTypes.Success]: () => import('./icons/success').then((s) => s.default),
  [IconTypes.Warning]: () => import('./icons/warning').then((s) => s.default),
  [IconTypes.Planet]: () => import('./icons/planet').then((s) => s.default),
  [IconTypes.Drag]: () => import('./icons/drag').then((s) => s.default),
  [IconTypes.DragSmall]: () =>
    import('./icons/drag-small').then((s) => s.default),
  [IconTypes.Help]: () => import('./icons/help').then((s) => s.default),
  [IconTypes.Locker]: () => import('./icons/locker').then((s) => s.default),
  [IconTypes.NavigationArrow]: () =>
    import('./icons/navigation-arrow').then((s) => s.default),
  [IconTypes.Reset]: () => import('./icons/reset').then((s) => s.default),
  [IconTypes.Settings]: () => import('./icons/settings').then((s) => s.default),
  [IconTypes.Star]: () => import('./icons/star').then((s) => s.default),
  [IconTypes.Add]: () => import('./icons/add').then((s) => s.default),
  [IconTypes.Increase]: () => import('./icons/add').then((s) => s.default),
  [IconTypes.Collapse]: () => import('./icons/add').then((s) => s.default), // merge with add
  [IconTypes.Minus]: () => import('./icons/minus').then((s) => s.default),
  [IconTypes.Decrease]: () => import('./icons/minus').then((s) => s.default),
  [IconTypes.Expand]: () => import('./icons/minus').then((s) => s.default), // merge with minus
  [IconTypes.Close]: () => import('./icons/close').then((s) => s.default),
  [IconTypes.Search]: () => import('./icons/search').then((s) => s.default),
};
