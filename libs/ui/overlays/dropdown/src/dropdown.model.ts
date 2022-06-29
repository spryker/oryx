import { Position, Size } from '../../../utilities';

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
   *
   * Defaults to Position.END.
   */
  position?: Position;

  /**
   * Allows to specify the size of the trigger icon element.
   *
   * This property will not be used when a custom trigger element is _slotted in_.
   *
   * @default `Size.medium`
   */
  triggerIconSize?: Size;
}
