import { CartEntry } from '@spryker-oryx/cart';
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

export interface CartEntryCompositionOptions extends CartEntryOptions {
  showOptions?: boolean;
  confirmationRequired?: boolean;
}

export interface CartEntryPrice {
  price?: number;
}

export const REMOVE_EVENT = 'oryx.remove';
