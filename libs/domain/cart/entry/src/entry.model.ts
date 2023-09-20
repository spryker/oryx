import { ProductAvailability } from '@spryker-oryx/product';

export interface CartEntryAttributes {
  /**
   * The entry key represents the unique identifier of the cart entry.
   */
  key?: string;

  /**
   * The sku represents the product or service for the cart entry.
   */
  sku?: string;

  /**
   * The number of items for the cart entry.
   */
  quantity?: number;

  /**
   * Regular unit price of the product, before volume discounts (see `discountedUnitPrice`).
   *
   * The given number represents the non formatted price.
   */
  unitPrice?: number;

  /**
   * Unit price after applying volume discount.
   *
   * The given number represents the non formatted price.
   */
  discountedUnitPrice?: number;

  /**
   * Subtotal price for the entry (quantity * discountedUnitPrice)
   *
   * The given number represents the non formatted price.
   */
  price?: number;

  /**
   * The item price represents the sales price of the item of the entry. This might be
   * a discounted price. Additional discounts can be given by volume pricing, see `price`.
   *
   * The given number represents the non formatted price.
   *
   * @deprecated use `unitPrice` instead
   */
  itemPrice?: number;

  /**
   * Indicates whether the cart entry can be edited. In readonly mode,
   * the quantity input and actions are hidden in the UI.
   */
  readonly?: boolean;
}

export interface CartEntryOptions {
  /**
   * Indicates whether the cart entry can be edited. In readonly mode,
   * the quantity input and actions are hidden in the UI.
   */
  readonly?: boolean;

  /**
   * Indicates whether the product ID is rendered on the cart entry.
   */
  enableItemId?: boolean;

  /**
   * Control showing product preview inside entry.
   */
  enableItemImage?: boolean;

  /**
   * Control showing product price inside entry.
   */
  enableItemPrice?: boolean;

  /**
   * Allow to remove entry when quantity is set to 0.
   * Possible options: 'allowZero' | 'showBin'
   */
  removeByQuantity?: RemoveByQuantity;

  /**
   * Renders a notification when the cart entry is updated.
   */
  notifyOnUpdate?: boolean;

  /**
   * Renders a notification when the cart entry is removed.
   */
  notifyOnRemove?: boolean;

  /**
   * Emit removing immediately without confirmation.
   */
  confirmBeforeRemove?: boolean;
}

export enum RemoveByQuantity {
  /**
   * Shows the bin icon at the minus control whenever the quantity is `1`.
   */
  ShowBin = 'showBin',

  /**
   * Allows to remove the product from cart when the quantity becomes zero.
   */
  Allowed = 'allowed',

  /**
   * Not allowed to remove the item by zero quantity.
   */
  NotAllowed = 'not-allowed',
}

export interface CartEntryCompositionOptions extends CartEntryOptions {
  availability?: ProductAvailability;
}
