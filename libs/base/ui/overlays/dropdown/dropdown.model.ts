import { Size } from '@spryker-oryx/utilities';

export enum Position {
  START = 'start',
  CENTER = 'center',
  END = 'end',
}

export interface DropdownProperties {
  /**
   * Indicates the open state of the dropdown. This is an optional property
   * that can be used to open the dropdown declaratively or programmatically.
   */
  open?: boolean;

  /**
   * The dropdown supports to positions: `Position.START` and `Position.END`.
   *
   * Start and end are logical positions, the location depends on the direction
   * of reading (i.e. start position is when dropdown to the right of the trigger
   * left-to-right reading direction).
   * Center is centering it against trigger element at the top or at the bottom.
   *
   * Defaults to Position.END.
   */
  position?: Position;

  /**
   * Change the alignments direction to vertical.
   * Controlled by 'vertical-align' attribute
   *
   * The dropdown will appear below or above (if not enough space below) the trigger;
   *
   * Defaults to false.
   */
  verticalAlign?: boolean;

  /**
   * Allows to specify the size of the trigger icon element.
   *
   * This property will not be used when a custom trigger element is _slotted in_.
   *
   * @default `Size.medium`
   */
  triggerIconSize?: Size;

  /**
   * Indicates that the popover will be opened on hover. The keyboard user will have a similarly
   * experience when the focus is moved to the trigger element.
   */
  openOnHover?: boolean;

  /**
   * Indicates that the popover will be opened on focus.
   * @deprecated since version 1.4 use openOnHover instead
   */
  showOnFocus?: boolean;
}
