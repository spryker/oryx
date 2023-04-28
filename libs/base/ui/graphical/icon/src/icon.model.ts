import { IconTypes } from '@spryker-oryx/themes/icons';
import { Size } from '@spryker-oryx/utilities';
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
   * An icon can make an alias to another icon, so that it will be used as a reference to an existing icon. This feature allows
   * for adding multiple semantic versions of the same icon.
   *
   * The icon is referenced by using SVGs `<use>` feature:
   *
   * ```svg
   * <symbol id="type">
   *  <use href="#alias"/>
   * <symbol>
   * ```
   */
  alias?: Icons | string;

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
   * Defaults to 'lg'.
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

export type Icons = typeof IconTypes;
