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
  Sales = 'sales',
  Dashboard = 'dashboard',
  Catalog = 'catalog',
  Customer = 'customer',
  Maintenance = 'maintenance',
  MerchantProfile = 'merchantProfile',
  Administration = 'administration',
  Users = 'users',
  Marketplace = 'marketplace',
  Merchandising = 'merchandising',
  Content = 'content',
  Ratings = 'ratings',
  Rocket = 'rocket',
}

export enum NavigationIcons {
  Dashboards = 'dashboards',
  Orders = 'orders',
  Merchant = 'merchant',
  Products = 'products',
  DarkMode = 'darkMode',
  LightMode = 'lightMode',
  Profile = 'profile',
}

export enum ViewIcons {
  Desktop = 'desktop',
  Tablet = 'tablet',
  Mobile = 'mobile',
}

export enum NotificationIcons {
  Success = 'success',
  Warning = 'warning',
  Error = 'error',
  Info = 'info',
}

export enum LanguageIcons {
  Planet = 'planet',
  Germany = 'germany',
  America = 'america',
  Spain = 'spain',
  France = 'france',
}

export enum MiscIcons {
  Close = 'close',
  Filters = 'filters',
  Search = 'search',
  Settings = 'settings',
  Sort = 'sort',
  Calendar = 'calendar',
  Imports = 'imports',
  Reset = 'reset',
  Copy = 'copy',
  Maximize = 'maximize',
  Minimize = 'minimize',
  Actions = 'actions',
  ActionsHorizontal = 'actionsHorizontal',
  Drag = 'drag',
  DragSmall = 'dragSmall',
  InputStepper = 'inputStepper',
  NavigationArrow = 'navigationArrow',
  InputError = 'inputError',
  Mark = 'mark',
  Comment = 'comment',
  Remove = 'remove',
  Minus = 'minus',
  Add = 'add',
  FastForward = 'fastForward',
  Create = 'create',
  Edit = 'edit',
  Trash = 'trash',
  File = 'file',
  Visible = 'visible',
  Invisible = 'invisible',
  Star = 'star',
  Integration = 'integration',
  Placeholder = 'placeholder',
  Dropdown = 'dropdown',
  DropUp = 'dropUp',
  Back = 'back',
  Front = 'front',
  Top = 'top',
  Bottom = 'bottom',
  Loader = 'loader',
  Disconnect = 'disconnect',
  Locker = 'locker',
  TextAreaResizable = 'textAreaResizable',
  Link = 'link',
  Help = 'help',
  Menu = 'menu',
}

export enum FilterIcons {
  Filter = 'filter',
  Popular = 'popular',
  GoldPartner = 'goldPartner',
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
