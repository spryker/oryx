import { ThemeIcons } from '@spryker-oryx/experience';
import { IconTypes } from '../icon.model';

export const fulfillmentIcons: ThemeIcons = {
  [IconTypes.Add]: () => import('./icons/add').then((s) => s.default),
  [IconTypes.AmbientCategory]: () =>
    import('./icons/ambient-category').then((s) => s.default),
  [IconTypes.BackArrow]: () =>
    import('./icons/back-arrow').then((s) => s.default),
  [IconTypes.Cart]: () => import('./icons/cart').then((s) => s.default),
  [IconTypes.CheckMark]: () =>
    import('./icons/check-mark').then((s) => s.default),
  [IconTypes.ChillerCategory]: () =>
    import('./icons/chiller-category').then((s) => s.default),
  [IconTypes.Close]: () => import('./icons/close').then((s) => s.default),
  [IconTypes.Edit]: () => import('./icons/edit').then((s) => s.default),
  [IconTypes.Filter]: () => import('./icons/filter').then((s) => s.default),
  [IconTypes.FreezerCategory]: () =>
    import('./icons/freezer-category').then((s) => s.default),
  [IconTypes.FreshCategory]: () =>
    import('./icons/fresh-category').then((s) => s.default),
  [IconTypes.Info]: () => import('./icons/info').then((s) => s.default),
  [IconTypes.Invisible]: () =>
    import('./icons/invisible').then((s) => s.default),
  [IconTypes.Loader]: () => import('./icons/loader').then((s) => s.default),
  [IconTypes.Minus]: () => import('./icons/minus').then((s) => s.default),
  [IconTypes.Profile]: () => import('./icons/profile').then((s) => s.default),
  [IconTypes.Refresh]: () => import('./icons/refresh').then((s) => s.default),
  [IconTypes.Remove]: () => import('./icons/remove').then((s) => s.default),
  [IconTypes.Search]: () => import('./icons/search').then((s) => s.default),
  [IconTypes.Visible]: () => import('./icons/visible').then((s) => s.default),
  /** Alias to minus */
  [IconTypes.Decrease]: () => import('./icons/minus').then((s) => s.default),
  /** Alias to add */
  [IconTypes.Increase]: () => import('./icons/add').then((s) => s.default),
};
