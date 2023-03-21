import { CartEntryOptions } from '../../entry/src';

export interface CartEntriesOptions extends CartEntryOptions {
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

  /**
   * Indicates whether the cart entry can be edited. In readonly mode,
   * the quantity input and actions are hidden in the UI.
   */
  readonly?: boolean;

  /**
   * Renders a notification when the cart entry is updated.
   */
  notifyOnUpdate?: boolean;

  /**
   * Renders a notification when the cart entry is removed.
   */
  notifyOnRemove?: boolean;
}
