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
   * The price represents the non formatted price for the cart entry's SKU.
   */
  price?: number;

  /**
   * Indicates whether the cart entry can be edited. In readonly mode,
   * the quantity input and actions are hidden in the UI.
   */
  readonly?: boolean;

  /**
   * Indicates the available order quantity. The value can be used to not oversell and
   * limit the quantity that can be added in the entry.
   */
  available?: number;
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
  enableId?: boolean;

  /**
   * Control showing product preview inside entry.
   */
  enablePreview?: boolean;

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
  AllowZero = 'allowZero',
}

export interface CartEntryCompositionOptions extends CartEntryOptions {
  showOptions?: boolean;
  confirmationRequired?: boolean;
  availability?: ProductAvailability;
}

export interface CartEntryPrice {
  price?: number;
}

export const REMOVE_EVENT = 'oryx.remove';

export interface CartEntryChangeEventDetail {
  quantity: number;
  groupKey: string;
  sku: string;
}
