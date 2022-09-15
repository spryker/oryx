import { TemplateResult } from 'lit';
import { Size } from '../../../utilities';

export interface IconProperties {
  /**
   * The icon type is used to select an svg element by ID from an icon sprite (svg).
   * Considering the following SVG, the icon of type 'add' would select the `<g>` element.
   *
   * ```html
   * <svg>
   *   <g id="add">
   *     <circle cx="12" cy="12" r="12" />
   *   </g>
   * </svg>
   * ```
   */
  type?: Icons | string;

  /**
   * The oryx icon system is based on 24px by 24px. The icons are centered inside this space
   * and are optimised to use the full size. In case you need a smaller icon, you can set the
   * icon size to `Size.medium` or `Size.small`.
   *
   * The icon size is controlled in CSS, using custom properties. You can alter all icons with
   * a global property, or use a local pro
   * Whenever the default sizes won't match, you can change the property:
   *
   * ```html
   * <div style="--oryx-icon-size: 40px">
   *   <oryx-icon>[...]</oryx-icon>
   * </div>
   * ```
   *
   * Defaults to 'large'.
   *
   * The default can be controlled by a CSS property (`--oryx-icon-size-default`)
   */
  size?: Size;

  /**
   * An SVG icon sprite combines multiple icons in a single resource. The resources
   * is loaded from the internet, which is why the sprite url can be configured.
   *
   * Defaults to `/assets/icons.svg`
   */
  sprite?: string;
}

export interface Icon extends IconProperties {
  /**
   * An SVG icon can be provide by its source and will be projected
   * in the icon slot.
   */
  source?: TemplateResult;
}
// Fallback for sprites generation
export const Icon = '';

export enum NavigationIconsV2 {
  Administration = 'administration',
  Catalog = 'catalog',
  Content = 'content',
  Customer = 'customer',
  Dashboard = 'dashboard',
  Maintenance = 'maintenance',
  Marketplace = 'marketplace',
  Merchandising = 'merchandising',
  MerchantProfile = 'merchantProfile',
  Ratings = 'ratings',
  Rocket = 'rocket',
  Sales = 'sales',
  Users = 'users',
}

export enum NavigationIcons {
  DarkMode = 'darkMode',
  Dashboards = 'dashboards',
  LightMode = 'lightMode',
  Merchant = 'merchant',
  Orders = 'orders',
  Products = 'products',
  Profile = 'profile',
}

export enum ViewIcons {
  Desktop = 'desktop',
  Mobile = 'mobile',
  Tablet = 'tablet',
}

export enum NotificationIcons {
  Error = 'error',
  Info = 'info',
  Success = 'success',
  Warning = 'warning',
}

export enum LanguageIcons {
  America = 'america',
  France = 'france',
  Germany = 'germany',
  Planet = 'planet',
  Spain = 'spain',
}

export enum MiscIcons {
  Actions = 'actions',
  ActionsHorizontal = 'actionsHorizontal',
  Add = 'add',
  Back = 'back',
  Bottom = 'bottom',
  Calendar = 'calendar',
  Cart = 'cart',
  CartAdd = 'cart-add',
  Close = 'close',
  Comment = 'comment',
  Copy = 'copy',
  Create = 'create',
  Disconnect = 'disconnect',
  Drag = 'drag',
  DragSmall = 'dragSmall',
  DropUp = 'dropUp',
  Dropdown = 'dropdown',
  Edit = 'edit',
  FastForward = 'fastForward',
  File = 'file',
  Filters = 'filters',
  Front = 'front',
  Help = 'help',
  Image = 'image',
  Imports = 'imports',
  InputError = 'inputError',
  InputStepper = 'inputStepper',
  Integration = 'integration',
  Invisible = 'invisible',
  Link = 'link',
  Loader = 'loader',
  Locker = 'locker',
  Mark = 'mark',
  Maximize = 'maximize',
  Menu = 'menu',
  Minimize = 'minimize',
  Minus = 'minus',
  NavigationArrow = 'navigationArrow',
  Placeholder = 'placeholder',
  Remove = 'remove',
  Reset = 'reset',
  Search = 'search',
  Settings = 'settings',
  Sort = 'sort',
  Star = 'star',
  TextAreaResizable = 'textAreaResizable',
  Top = 'top',
  Trash = 'trash',
  Visible = 'visible',
}

export enum FilterIcons {
  Filter = 'filter',
  GoldPartner = 'goldPartner',
  Popular = 'popular',
  SilverPartner = 'silverPartner',
}

export const IconTypes = {
  ...NavigationIconsV2,
  ...NavigationIcons,
  ...ViewIcons,
  ...NotificationIcons,
  ...MiscIcons,
  ...FilterIcons,
  ...LanguageIcons,
};

export type Icons = typeof IconTypes;
