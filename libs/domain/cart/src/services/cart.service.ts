import { QueryState } from '@spryker-oryx/core';
import { Observable } from 'rxjs';
import {
  AddCartEntryQualifier,
  Cart,
  CartEntry,
  CartEntryQualifier,
  CartQualifier,
  UpdateCartEntryQualifier,
} from '../models';

export interface CartService {
  getCart(data?: CartQualifier): Observable<Cart | undefined>;
  getCartState(data?: CartQualifier): Observable<QueryState<Cart>>;
  getEntries(data?: CartQualifier): Observable<CartEntry[]>;
  addEntry(data: AddCartEntryQualifier): Observable<unknown>;
  updateEntry(data: UpdateCartEntryQualifier): Observable<unknown>;
  deleteEntry(data: CartEntryQualifier): Observable<unknown>;

  updateCart(data: CartQualifier): Observable<unknown>;
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
