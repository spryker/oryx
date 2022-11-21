import { ThemeIcons } from '@spryker-oryx/core';
import { IconTypes } from '../icon.model';

export const backofficeIcons: ThemeIcons = {
  [IconTypes.Add]: () => import('./icons/add').then((s) => s.default),
  [IconTypes.CartAdd]: () => import('./icons/cart-add').then((s) => s.default),
  [IconTypes.Cart]: () => import('./icons/cart').then((s) => s.default),
  [IconTypes.Close]: () => import('./icons/close').then((s) => s.default),
  [IconTypes.Collapse]: () => import('./icons/collapse').then((s) => s.default),
  [IconTypes.DropUp]: () => import('./icons/drop-up').then((s) => s.default),
  [IconTypes.Dropdown]: () => import('./icons/dropdown').then((s) => s.default),
  [IconTypes.Expand]: () => import('./icons/expand').then((s) => s.default),
  [IconTypes.Image]: () => import('./icons/image').then((s) => s.default),
  [IconTypes.Info]: () => import('./icons/info').then((s) => s.default),
  [IconTypes.InputError]: () =>
    import('./icons/input-error').then((s) => s.default),
  [IconTypes.Mark]: () => import('./icons/mark').then((s) => s.default),
  [IconTypes.Minus]: () => import('./icons/minus').then((s) => s.default),
  [IconTypes.Remove]: () => import('./icons/remove').then((s) => s.default),
  [IconTypes.Rocket]: () => import('./icons/rocket').then((s) => s.default),
  [IconTypes.Search]: () => import('./icons/search').then((s) => s.default),
  [IconTypes.Trash]: () => import('./icons/trash').then((s) => s.default),
  [IconTypes.Visible]: () => import('./icons/visible').then((s) => s.default),
  [IconTypes.Invisible]: () =>
    import('./icons/invisible').then((s) => s.default),
  [IconTypes.Wishlist]: () => import('./icons/wishlist').then((s) => s.default),
  [IconTypes.Administration]: () =>
    import('./icons/administration').then((s) => s.default),
  [IconTypes.Catalog]: () => import('./icons/catalog').then((s) => s.default),
  [IconTypes.Content]: () => import('./icons/content').then((s) => s.default),
  [IconTypes.Customer]: () => import('./icons/customer').then((s) => s.default),
  [IconTypes.Dashboard]: () =>
    import('./icons/dashboard').then((s) => s.default),
  [IconTypes.Maintenance]: () =>
    import('./icons/maintenance').then((s) => s.default),
  [IconTypes.Marketplace]: () =>
    import('./icons/marketplace').then((s) => s.default),
  [IconTypes.Merchandising]: () =>
    import('./icons/merchandising').then((s) => s.default),
  [IconTypes.MerchantProfile]: () =>
    import('./icons/merchant-profile').then((s) => s.default),
  [IconTypes.Ratings]: () => import('./icons/ratings').then((s) => s.default),
  [IconTypes.Sales]: () => import('./icons/sales').then((s) => s.default),
  [IconTypes.Users]: () => import('./icons/users').then((s) => s.default),
  [IconTypes.DarkMode]: () =>
    import('./icons/dark-mode').then((s) => s.default),
  [IconTypes.Dashboards]: () =>
    import('./icons/dashboards').then((s) => s.default),
  [IconTypes.LightMode]: () =>
    import('./icons/light-mode').then((s) => s.default),
  [IconTypes.Merchant]: () => import('./icons/merchant').then((s) => s.default),
  [IconTypes.Orders]: () => import('./icons/orders').then((s) => s.default),
  [IconTypes.Products]: () => import('./icons/products').then((s) => s.default),
  [IconTypes.Profile]: () => import('./icons/profile').then((s) => s.default),
  [IconTypes.Desktop]: () => import('./icons/desktop').then((s) => s.default),
  [IconTypes.Mobile]: () => import('./icons/mobile').then((s) => s.default),
  [IconTypes.Tablet]: () => import('./icons/tablet').then((s) => s.default),
  [IconTypes.Error]: () => import('./icons/error').then((s) => s.default),
  [IconTypes.Success]: () => import('./icons/success').then((s) => s.default),
  [IconTypes.Warning]: () => import('./icons/warning').then((s) => s.default),
  [IconTypes.America]: () => import('./icons/america').then((s) => s.default),
  [IconTypes.France]: () => import('./icons/france').then((s) => s.default),
  [IconTypes.Germany]: () => import('./icons/germany').then((s) => s.default),
  [IconTypes.Planet]: () => import('./icons/planet').then((s) => s.default),
  [IconTypes.Spain]: () => import('./icons/spain').then((s) => s.default),
  [IconTypes.Actions]: () => import('./icons/actions').then((s) => s.default),
  [IconTypes.ActionsHorizontal]: () =>
    import('./icons/actions-horizontal').then((s) => s.default),
  [IconTypes.Back]: () => import('./icons/back').then((s) => s.default),
  [IconTypes.Bottom]: () => import('./icons/bottom').then((s) => s.default),
  [IconTypes.Calendar]: () => import('./icons/calendar').then((s) => s.default),
  [IconTypes.Copy]: () => import('./icons/copy').then((s) => s.default),
  [IconTypes.Create]: () => import('./icons/create').then((s) => s.default),
  [IconTypes.Disconnect]: () =>
    import('./icons/disconnect').then((s) => s.default),
  [IconTypes.Drag]: () => import('./icons/drag').then((s) => s.default),
  [IconTypes.DragSmall]: () =>
    import('./icons/drag-small').then((s) => s.default),
  [IconTypes.Edit]: () => import('./icons/edit').then((s) => s.default),
  [IconTypes.FastForward]: () =>
    import('./icons/fast-forward').then((s) => s.default),
  [IconTypes.File]: () => import('./icons/file').then((s) => s.default),
  [IconTypes.Filters]: () => import('./icons/filters').then((s) => s.default),
  [IconTypes.Front]: () => import('./icons/front').then((s) => s.default),
  [IconTypes.Help]: () => import('./icons/help').then((s) => s.default),
  [IconTypes.Imports]: () => import('./icons/imports').then((s) => s.default),
  [IconTypes.InputStepper]: () =>
    import('./icons/input-stepper').then((s) => s.default),
  [IconTypes.Integration]: () =>
    import('./icons/integration').then((s) => s.default),
  [IconTypes.Link]: () => import('./icons/link').then((s) => s.default),
  [IconTypes.Loader]: () => import('./icons/loader').then((s) => s.default),
  [IconTypes.Locker]: () => import('./icons/locker').then((s) => s.default),
  [IconTypes.Maximize]: () => import('./icons/maximize').then((s) => s.default),
  [IconTypes.Menu]: () => import('./icons/menu').then((s) => s.default),
  [IconTypes.Minimize]: () => import('./icons/minimize').then((s) => s.default),
  [IconTypes.NavigationArrow]: () =>
    import('./icons/navigation-arrow').then((s) => s.default),
  [IconTypes.Placeholder]: () =>
    import('./icons/placeholder').then((s) => s.default),
  [IconTypes.Reset]: () => import('./icons/reset').then((s) => s.default),
  [IconTypes.Settings]: () => import('./icons/settings').then((s) => s.default),
  [IconTypes.Sort]: () => import('./icons/sort').then((s) => s.default),
  [IconTypes.Star]: () => import('./icons/star').then((s) => s.default),
  [IconTypes.TextAreaResizable]: () =>
    import('./icons/text-area-resizable').then((s) => s.default),
  [IconTypes.Top]: () => import('./icons/top').then((s) => s.default),
  [IconTypes.Filter]: () => import('./icons/filter').then((s) => s.default),
  [IconTypes.GoldPartner]: () =>
    import('./icons/gold-partner').then((s) => s.default),
  [IconTypes.Popular]: () => import('./icons/popular').then((s) => s.default),
  [IconTypes.SilverPartner]: () =>
    import('./icons/silver-partner').then((s) => s.default),

  /** Alias to minus */
  [IconTypes.Decrease]: () => import('./icons/minus').then((s) => s.default),
  /** Alias to add */
  [IconTypes.Increase]: () => import('./icons/add').then((s) => s.default),
};
