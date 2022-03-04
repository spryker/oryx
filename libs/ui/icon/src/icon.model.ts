import { TemplateResult } from 'lit';

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
   * icon size to `IconSize.medium` or `IconSize.small`.
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
  size?: IconSize;

  /**
   * An SVG icon sprite combines multiple icons in a single resource. The resources
   * is loaded from the internet, which is why the sprite url can be configured.
   *
   * Defaults to `assets/icons.svg`
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

export const enum IconSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
}

export enum NavigationIcons {
  Rocket = 'rocket',
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
  Germany = 'germany',
}

export enum MiscIcons {
  Add = 'add',
  Back = 'back',
  Close = 'close',
  CloseAll = 'close_all',
  Drag = 'drag',
  Dropdown = 'dropdown-arrow',
  Loader = 'loader',
  Mark = 'mark',
  Remove = 'remove',
  Reset = 'reset',
  Search = 'search',
  Trash = 'trash',
  Visible = 'visible',
  Invisible = 'invisible',
  Link = 'link',
}

export enum FilterIcons {
  Filter = 'filter',
}

export const IconTypes = {
  ...NavigationIcons,
  ...ViewIcons,
  ...NotificationIcons,
  ...MiscIcons,
  ...FilterIcons,
  ...LanguageIcons,
};

export type Icons = typeof IconTypes;
