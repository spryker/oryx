import { CartEntry } from '@spryker-oryx/cart';

export interface CartEntriesOptions extends CartEntry {
  /**
   * Identifier of the cart.
   */
  cartId?: string;
}
