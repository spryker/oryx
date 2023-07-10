import { IconMapper } from '@spryker-oryx/experience';
import { IconTypes } from '@spryker-oryx/ui/icon';

export const backofficeIcons: IconMapper = {
  svg: true,
  mapping: {
    [IconTypes.CartAdd]: () =>
      import('./icons/cart-add').then((s) => s.default),
    [IconTypes.Cart]: () => import('./icons/cart').then((s) => s.default),
    [IconTypes.Image]: () => import('./icons/image').then((s) => s.default),
    [IconTypes.Info]: () => import('./icons/info').then((s) => s.default),
    [IconTypes.Error]: () => import('./icons/error').then((s) => s.default),
    [IconTypes.InputError]: () =>
      import('./icons/input-error').then((s) => s.default),
    [IconTypes.Remove]: () => import('./icons/remove').then((s) => s.default),
    [IconTypes.Rocket]: () => import('./icons/rocket').then((s) => s.default),
    [IconTypes.Trash]: () => import('./icons/trash').then((s) => s.default),
    [IconTypes.Loader]: () => import('./icons/loader').then((s) => s.default),
    [IconTypes.Visible]: () => import('./icons/visible').then((s) => s.default),
    [IconTypes.Invisible]: () =>
      import('./icons/invisible').then((s) => s.default),
    [IconTypes.Wishlist]: () =>
      import('./icons/wishlist').then((s) => s.default),
    [IconTypes.Ratings]: () => import('./icons/ratings').then((s) => s.default),
    [IconTypes.Orders]: () => import('./icons/orders').then((s) => s.default),
    [IconTypes.Products]: () =>
      import('./icons/products').then((s) => s.default),
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
    [IconTypes.Settings]: () =>
      import('./icons/settings').then((s) => s.default),
    [IconTypes.Star]: () => import('./icons/star').then((s) => s.default),
    [IconTypes.Add]: () => import('./icons/add').then((s) => s.default),
    [IconTypes.Minus]: () => import('./icons/minus').then((s) => s.default),
    [IconTypes.Close]: () => import('./icons/close').then((s) => s.default),
    [IconTypes.Search]: () => import('./icons/search').then((s) => s.default),
    [IconTypes.Edit]: () => import('./icons/edit').then((s) => s.default),
    [IconTypes.Actions]: () => import('./icons/actions').then((s) => s.default),
    [IconTypes.ActionsHorizontal]: () =>
      import('./icons/actions-horizontal').then((s) => s.default),
    [IconTypes.Back]: () => import('./icons/back').then((s) => s.default),
    [IconTypes.Front]: () => import('./icons/front').then((s) => s.default),
    [IconTypes.Check]: () => import('./icons/check').then((s) => s.default),
    [IconTypes.DropUp]: () => import('./icons/drop-up').then((s) => s.default),
    [IconTypes.Dropdown]: () =>
      import('./icons/dropdown').then((s) => s.default),
    [IconTypes.Maximize]: () =>
      import('./icons/maximize').then((s) => s.default),
    [IconTypes.Minimize]: () =>
      import('./icons/minimize').then((s) => s.default),
    [IconTypes.Calendar]: () =>
      import('./icons/calendar').then((s) => s.default),
    [IconTypes.Sort]: () => import('./icons/sort').then((s) => s.default),
    [IconTypes.Filter]: () => import('./icons/filter').then((s) => s.default),
  },
};
