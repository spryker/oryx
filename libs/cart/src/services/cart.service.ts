import { HttpErrorResponse } from '@spryker-oryx/core';
import { Observable, ReplaySubject } from 'rxjs';
import {
  AddCartEntryQualifier,
  Cart,
  CartEntry,
  CartQualifier,
  CartTotals,
  DeleteCartEntryQualifier,
  LoadCartsQualifier,
  UpdateCartEntryQualifier,
} from '../models';

export interface STATE {
  value$: ReplaySubject<Cart | null>;
  error$: ReplaySubject<HttpErrorResponse | null>;
}

export interface CartService {
  load(data?: LoadCartsQualifier): Observable<Cart | null>;
  getCart(data?: CartQualifier): Observable<Cart | null>;
  getCartError(data?: CartQualifier): Observable<HttpErrorResponse | null>;
  getTotals(data?: CartQualifier): Observable<CartTotals | null>;
  getEntries(data?: CartQualifier): Observable<CartEntry[] | []>;
  addEntry(data: AddCartEntryQualifier): Observable<null>;
  updateEntry(data: UpdateCartEntryQualifier): Observable<null>;
  deleteEntry(data: DeleteCartEntryQualifier): Observable<null>;
}

export const CartService = 'FES.CartService';

declare global {
  interface InjectionTokensContractMap {
    [CartService]: CartService;
  }
}
