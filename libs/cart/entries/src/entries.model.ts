import { CartEntry } from '@spryker-oryx/cart';

export interface CartEntriesOptions extends CartEntry {
  /**
   * Identifier of the cart.
   */
  cartId?: string;

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
}
