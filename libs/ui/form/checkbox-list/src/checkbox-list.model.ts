import { Direction } from '../../../utilities/model';

export interface CheckboxListProperties {
  /**
   * The heading of the list can be set, using the `heading` property
   * or by using the slot:
   *
   * ```html
   * <checkbox-list>
   *   <span slot="heading">heading</span>
   * </checkbox-list>
   * ```
   */
  heading?: string;

  /**
   * The layout direction of the list, either horizontal or vertical.
   * This option will only set `flex-direction`, either column or row,
   * which can also be set on the host.
   */
  direction?: Direction;
}

export enum CheckboxListStatus {
  checked = 'checked',
  unchecked = 'unchecked',
  partiallyChecked = 'partiallyChecked',
}
