import { ResourceIcons } from '@spryker-oryx/experience';
import { IconTypes } from '../icon.model';

export const storefrontIcons: ResourceIcons = {
  [IconTypes.Loader]: () =>
    import('../backoffice/icons/loader').then((s) => s.default),
  [IconTypes.Add]: () => import('./icons/add').then((s) => s.default),
  [IconTypes.Back]: () => import('./icons/back').then((s) => s.default),
  [IconTypes.Carrier]: () => import('./icons/carrier').then((s) => s.default),
  [IconTypes.Increase]: () => import('./icons/minus').then((s) => s.default),
  [IconTypes.CartAdd]: () => import('./icons/cart-add').then((s) => s.default),
  [IconTypes.Cart]: () => import('./icons/cart').then((s) => s.default),
  [IconTypes.Calendar]: () => import('./icons/calendar').then((s) => s.default),
  [IconTypes.Close]: () => import('./icons/close').then((s) => s.default),
  [IconTypes.Collapse]: () => import('./icons/collapse').then((s) => s.default),
  [IconTypes.DropUp]: () => import('./icons/drop-up').then((s) => s.default),
  [IconTypes.Dropdown]: () => import('./icons/dropdown').then((s) => s.default),
  [IconTypes.Edit]: () => import('./icons/edit').then((s) => s.default),
  [IconTypes.Error]: () => import('./icons/error').then((s) => s.default),
  [IconTypes.Expand]: () => import('./icons/expand').then((s) => s.default),
  [IconTypes.Image]: () => import('./icons/image').then((s) => s.default),
  [IconTypes.Info]: () => import('./icons/info').then((s) => s.default),
  [IconTypes.InputError]: () =>
    import('./icons/input-error').then((s) => s.default),
  [IconTypes.Mark]: () => import('./icons/mark').then((s) => s.default),
  [IconTypes.Minus]: () => import('./icons/minus').then((s) => s.default),
  [IconTypes.Parcel]: () => import('./icons/parcel').then((s) => s.default),
  [IconTypes.Printer]: () => import('./icons/printer').then((s) => s.default),
  [IconTypes.Remove]: () => import('./icons/remove').then((s) => s.default),
  [IconTypes.Rocket]: () => import('./icons/rocket').then((s) => s.default),
  [IconTypes.Search]: () => import('./icons/search').then((s) => s.default),
  [IconTypes.Success]: () => import('./icons/success').then((s) => s.default),
  [IconTypes.Trash]: () => import('./icons/trash').then((s) => s.default),
  [IconTypes.Visible]: () => import('./icons/visible').then((s) => s.default),
  [IconTypes.Invisible]: () =>
    import('./icons/invisible').then((s) => s.default),
  [IconTypes.Warning]: () => import('./icons/warning').then((s) => s.default),
  [IconTypes.Wishlist]: () => import('./icons/wishlist').then((s) => s.default),
  [IconTypes.Location]: () => import('./icons/location').then((s) => s.default),
  [IconTypes.NavigationArrow]: () =>
    import('./icons/navigation-arrow').then((s) => s.default),
  [IconTypes.Actions]: () => import('./icons/actions').then((s) => s.default),

  /** Alias to minus */
  [IconTypes.Decrease]: () => import('./icons/minus').then((s) => s.default),
  /** Alias to add */
  [IconTypes.Increase]: () => import('./icons/add').then((s) => s.default),
  [IconTypes.User]: () => import('./icons/user').then((s) => s.default),
  [IconTypes.Login]: () => import('./icons/login').then((s) => s.default),
  [IconTypes.ModeLight]: () =>
    import('./icons/mode-light').then((s) => s.default),
  [IconTypes.ModeDark]: () =>
    import('./icons/mode-dark').then((s) => s.default),
};
