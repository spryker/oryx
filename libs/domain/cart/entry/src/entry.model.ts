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
   * The price represents the non formatted price for the cart entry's SKU.
   */
  price?: number;

  /**
   * The item sales price that override the item sales price.
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
