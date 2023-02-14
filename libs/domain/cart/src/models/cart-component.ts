import { Cart } from './';

export interface CartComponentAttributes {
  /**
   * Identifier of the cart.
   */
  cartId?: string;
  /**
   * Manually provide whole cart object.
   */
  cart?: Cart;
}
