import { Size } from '@spryker-oryx/utilities';
import { IconTypes } from '../../graphical/icon/src';

export interface ActionComponentAttributes {
  /**
   * The action components can be used with a button element as well as an anchor link.
   * The visual presentation of the action is can be specified using the `type` property.
   * There are four types of actions, which are:
   * - `ActionType.Button`
   * - `ActionType.Text`
   * - `ActionType.Icon`
   * - `ActionType.Tile`
   *
   * Most styles for the action type also use the `cta` property to indicate that the action is
   * a call-to-action. The `cta` property is a boolean value and is set to `true` by default.
   */
  type?: ActionType;

  /**
   * Indicates whether the action is a call-to-action. A call-to-action typically ads more emphasis
   * to the action, for example, by using a different color or solid background color.
   */
  cta?: boolean;

  /**
   * The size of the action can be configured.
   *
   * By default, when no size is given, the size is derived from the current font-size, using `em`.
   * If the font-size is smaller or larger, the content and real estate of the action will change
   * accordingly. This is a common practice as it does not require any specific size configuration.
   * Moreover, the size is response, meaning that it will change according to the font-size when
   * it is changed for a specific breakpoint.
   *
   * The small and large size will affect the font-size, using the following design tokens:
   *
   * - `--oryx-action-sm`
   *   defaults to `calc(1rem - 2px)`
   * - `--oryx-action-lg`
   *   defaults to `calc(1rem + 2px)`
   */
  size?: ActionSize;

  /**
   * The action element is rendered as an inline element by default. The outer layout can adjust
   * the layout of the action, for example, by using a grid layout. However, the action can also be
   * rendered as a block element, which will make the action fill the entire width of the parent.
   */
  block?: boolean;

  /**
   * Indicates whether the action is an alert. An alert action typically ads more emphasis
   * to the action, for example, by using a red color. Alert actions are often used to indicate
   * that the action is destructive, for example, when deleting an item.
   */
  alert?: boolean;

  /**
   * Actions can have a visual icon in addition to the (slotted) text of the element. Icons can
   * be used as a visual addition to the element or be used instead of a text label.
   *
   * Icons are rendered before the (slotted) text of the elements. If the icon should be rendered
   * after the text, use the `iconAfter` property instead. You can also use an icon before and after
   * the text.
   */
  icon?: IconTypes | string;

  /**
   * Similar to the `icon` property, the `iconAfter` can be used to add an icon to the action. The
   * icon will be rendered after the (slotted) text of the element.
   */
  iconAfter?: IconTypes | string;

  /**
   * The label text used by screen readers. The label is optional as the text of the component is used
   * as a fallback. However, in case there's
   */
  label?: string;

  /**
   * The mark contains an additional text label that appears next to the button.
   */
  mark?: string;

  /**
   * The URL to link to when the button is clicked. If provided, the button will appear as a link.
   * If `href` is used, a link is created that looks like a button.
   */
  href?: string;

  state?: ActionState;

  /**
   * The disabled state of the rendered button can be controlled using the `disabled` property.
   *
   * ```html
   * <oryx-action disabled>...</oryx-action>
   * ```
   *
   * When the actual button or link is slotted, the `disabled` property can be omitted, since
   * the native disabled attribute can be used instead:
   *
   * ```html
   * <oryx-action>
   *  <button disabled>...</button>
   * </oryx-action>
   * ```
   */
  disabled?: boolean;

  /**
   * Indicates whether the button is active, which is similar to the `:active` CSS pseudo-class.
   * This is typically used for toggle buttons or elements that represent an active state, for example,
   * when a link is active when the href is the current route.
   */
  active?: boolean;

  /**
   * Indicates whether the button is in a loading state. When `loading` is set to `true`, the
   * loading icon is rendered on the action.
   */
  loading?: boolean;

  /**
   * Indicates whether the button is in a confirmed state. When `confirmed` is set to `true`, the
   * confirmed icon is rendered on the action.
   */
  confirmed?: boolean;
}

export const enum ActionSize {
  Sm = Size.Sm,
  Md = Size.Md,
  Lg = Size.Lg,
}

export const enum ActionColor {
  Primary = 'primary',
  Neutral = 'neutral',
  Error = 'error',
}

/**
 * Represents the types of buttons.
 */
export const enum ActionType {
  Button = 'button',
  Text = 'text',
  Icon = 'icon',
  Tile = 'tile',
}

export const enum ActionState {
  Disabled = 'disabled',
  Active = 'active',
  Loading = 'loading',
  Confirmed = 'confirmed',
}
