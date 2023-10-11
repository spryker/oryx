import { Transformer } from '@spryker-oryx/core';
import { Observable } from 'rxjs';
import {
  AddCartEntryQualifier,
  Cart,
  CartEntryQualifier,
  CartQualifier,
  UpdateCartEntryQualifier,
} from '../../models';

export interface CartAdapter {
  getAll: () => Observable<Cart[]>;
  get: (data: CartQualifier) => Observable<Cart>;
  addEntry: (data: AddCartEntryQualifier) => Observable<Cart>;
  deleteEntry: (data: CartEntryQualifier) => Observable<unknown>;
  updateEntry: (data: UpdateCartEntryQualifier) => Observable<Cart>;
}

export const CartAdapter = 'oryx.CartAdapter';

export const CartNormalizer = 'oryx.CartNormalizer*';
export const CartsNormalizer = 'oryx.CartsNormalizer*';

declare global {
  interface InjectionTokensContractMap {
    [CartAdapter]: CartAdapter;
    [CartNormalizer]: Transformer<Cart>[];
    [CartsNormalizer]: Transformer<Cart[]>[];
  }
}
