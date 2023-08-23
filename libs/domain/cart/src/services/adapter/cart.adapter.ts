import { Observable } from 'rxjs';
import {
  AddCartEntryQualifier,
  Cart,
  CartEntryQualifier,
  CartQualifier,
  UpdateCartEntryQualifier,
  UpdateCartPriceModeQualifier,
} from '../../models';

export interface CartAdapter {
  getAll: () => Observable<Cart[]>;
  get: (data: CartQualifier) => Observable<Cart>;
  addEntry: (data: AddCartEntryQualifier) => Observable<Cart>;
  deleteEntry: (data: CartEntryQualifier) => Observable<unknown>;
  updateEntry: (data: UpdateCartEntryQualifier) => Observable<Cart>;
  updateCartPriceMode: (data: UpdateCartPriceModeQualifier) => Observable<Cart>;
}

export const CartAdapter = 'oryx.CartAdapter';

declare global {
  interface InjectionTokensContractMap {
    [CartAdapter]: CartAdapter;
  }
}
