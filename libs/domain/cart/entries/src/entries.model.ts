import { CartEntryOptions } from '../../entry/src';

export interface CartEntriesOptions extends CartEntryOptions {
  /**
   * Indicates whether wrap the entries into the collapsible container or not
   *
   * @default false
   */
  collapsible?: boolean;

  /**
   * Set default state of collapsible container as expanded
   *
   * @default false
   */
  expanded?: boolean;

  /**
   * Hide the chip with total items count in the header of collapsible container.
   *
   * @default false
   */
  hideItemsCount?: boolean;

  /**
   * Emit removing immediately without confirmation.
   */
  silentRemove?: boolean;
}
