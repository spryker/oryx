import { Observable } from 'rxjs';
import { Cart, CartEntryAttributesQualifier } from '../../models';

export interface GetCartProps {
  cartId: string;
}

export interface AddCartEntityProps {
  cartId: string;
  attributes: CartEntryAttributesQualifier;
}

export interface UpdateCartEntityProps {
  cartId: string;
  groupKey: string;
  attributes: CartEntryAttributesQualifier;
}

export interface DeleteCartEntityProps {
  cartId: string;
  groupKey: string;
}

export interface CartAdapter {
  getAll: () => Observable<Cart[]>;
  get: (data: GetCartProps) => Observable<Cart>;
  addEntry: (data: AddCartEntityProps) => Observable<Cart>;
  deleteEntry: (data: DeleteCartEntityProps) => Observable<unknown>;
  updateEntry: (data: UpdateCartEntityProps) => Observable<Cart>;
}

export const CartAdapter = 'oryx.CartAdapter';

declare global {
  interface InjectionTokensContractMap {
    [CartAdapter]: CartAdapter;
  }
}
