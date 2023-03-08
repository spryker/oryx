import { QueryState } from '@spryker-oryx/core';
import { Observable } from 'rxjs';
import {
  AddCartEntryQualifier,
  Cart,
  CartEntry,
  CartEntryQualifier,
  CartQualifier,
  CartTotals,
  UpdateCartEntryQualifier,
} from '../models';

export interface CartService {
  load(): void;
  getCart(data?: CartQualifier): Observable<Cart | undefined>;
  getCartState(data?: CartQualifier): Observable<QueryState<Cart>>;
  getTotals(data?: CartQualifier): Observable<CartTotals | null>;
  getEntries(data?: CartQualifier): Observable<CartEntry[]>;
  addEntry(data: AddCartEntryQualifier): Observable<unknown>;
  updateEntry(data: UpdateCartEntryQualifier): Observable<unknown>;
  deleteEntry(data: CartEntryQualifier): Observable<unknown>;
  /**
   * Get busy state for either cart or individual entry by groupKey
   */
  isBusy(qualifier?: CartEntryQualifier): Observable<boolean>;
  isEmpty(data?: CartQualifier): Observable<boolean>;
}

export const CartService = 'oryx.CartService';

declare global {
  interface InjectionTokensContractMap {
    [CartService]: CartService;
  }
}
