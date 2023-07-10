import { Direction } from '@spryker-oryx/ui';
import { ErrorOptions } from '../../input';

export interface InputListProperties extends Partial<ErrorOptions> {
  /**
   * The heading of the list can be set, using the `heading` property
   * or by using the slot:
   *
   * ```html
   * <oryx-input-list>
   *   <span slot="heading">heading</span>
   * </oryx-input-list>
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

export enum InputListStatus {
  checked = 'checked',
  unchecked = 'unchecked',
  partiallyChecked = 'partiallyChecked',
}
