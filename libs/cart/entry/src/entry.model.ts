import { CartEntry } from '@spryker-oryx/cart';
import { ProductAvailability } from '@spryker-oryx/product';
import { Icons } from '@spryker-oryx/ui/icon';

export interface CartEntryProperties {
  options?: CartEntryOptions;
}
export interface CartEntryOptions extends CartEntry {
  /**
   * Makes the options section expanded by default.
   */
  defaultExpandedOptions?: boolean;

  /**
   * Control showing product preview inside entry.
   */
  hidePreview?: boolean;

  /**
   * Allow to remove entry when quantity is set to 0.
   * Possible options: 'allowZero' | 'showBin'
   */
  removeByQuantity?: RemoveByQuantity;

  /**
   * Emit removing immediately without confirmation.
   */
  silentRemove?: boolean;

  /**
   * Custom icon for remove entry button.
   *
   * @default 'close'
   */
  removeButtonIcon?: Icons;

  /**
   * Indicates that all types of interactions are disabled
   */
  disabled?: boolean;

  /**
   * Indicates that entry is updating
   */
  updating?: boolean;
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
