import { CartEntryOptions } from '@spryker-oryx/cart/entry';

export interface OrderEntriesOptions extends CartEntryOptions {
  limit?: number;
  threshold?: number;
}
