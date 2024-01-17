import { Transformer } from '@spryker-oryx/core';
import { Observable } from 'rxjs';
import {
  AddCartEntryQualifier,
  Cart,
  CartEntryQualifier,
  CartQualifier,
  CouponQualifier,
  CreateCartQualifier,
  UpdateCartEntryQualifier,
  UpdateCartQualifier,
} from '../../models';

export interface CartAdapter {
  getAll: () => Observable<Cart[]>;
  get: (data: CartQualifier) => Observable<Cart>;
  addEntry: (data: AddCartEntryQualifier) => Observable<Cart>;
  addCoupon: (data: CouponQualifier) => Observable<Cart>;
  deleteCoupon: (data: CouponQualifier) => Observable<unknown>;
  deleteEntry: (data: CartEntryQualifier) => Observable<unknown>;
  updateEntry: (data: UpdateCartEntryQualifier) => Observable<Cart>;
  update: (data: UpdateCartQualifier) => Observable<Cart>;
  create: (data?: CreateCartQualifier) => Observable<Cart>;
  delete: (data: CartQualifier) => Observable<unknown>;
}

export const CartAdapter = 'oryx.CartAdapter';

export const CartNormalizer = 'oryx.CartNormalizer*';
export const CartsNormalizer = 'oryx.CartsNormalizer*';

declare global {
  interface InjectionTokensContractMap {
    [CartAdapter]: CartAdapter;
    [CartNormalizer]: Transformer<Cart>;
    [CartsNormalizer]: Transformer<Cart[]>;
  }
}
