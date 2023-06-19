import { CartEntryOptions } from '@spryker-oryx/cart/entry';

export interface OrderEntriesAttributes {
  /**
   * Expand/collapse the list of entries
   */
  expanded?: boolean;
}

export interface OrderEntriesOptions extends CartEntryOptions {
  /**
   * Maximum amount of entries to show in collapsed state
   */
  limit?: number;
  /**
   * The `threshold` option is used in conjunction with the `limit` option to determine the number of items to display.
   * When amount of items are greater than `limit + threshold`, only the first `limit` items will be shown
   * along with toggle button
   *
   * @remarks
   * The purpose of the `threshold` option is to provide a grace margin beyond `limit`
   * where some additional items can be shown, based on a predefined threshold value.
   *
   * @example
   * Consider a scenario where `limit` is set to 5 and `threshold` is set to 2.
   *
   * - If there are 8 entries, only the first 5 items will be displayed and button to show the rest 3.
   * - If there are less than 8 entries, all items will be shown without button.
   */
  threshold?: number;
}
