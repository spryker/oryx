import { Observable } from 'rxjs';
import { Cart, CartEntryAttributesQualifier } from '../../models';
import { UserData } from '../user.service';

export interface GetCartProps {
  user: UserData;
  cartId: string;
}

export interface AddCartEntityProps {
  user: UserData;
  cartId: string;
  attributes: CartEntryAttributesQualifier;
}

export interface UpdateCartEntityProps {
  user: UserData;
  cartId: string;
  groupKey: string;
  attributes: CartEntryAttributesQualifier;
}

export interface DeleteCartEntityProps {
  user: UserData;
  cartId: string;
  groupKey: string;
}

export interface CartAdapter {
  getAll: (user: UserData) => Observable<Cart[]>;
  get: (data: GetCartProps) => Observable<Cart>;
  addEntry: (data: AddCartEntityProps) => Observable<Cart>;
  deleteEntry: (data: DeleteCartEntityProps) => Observable<unknown>;
  updateEntry: (data: UpdateCartEntityProps) => Observable<Cart>;
}

export const CartAdapter = 'FES.CartAdapter';

declare global {
  interface InjectionTokensContractMap {
    [CartAdapter]: CartAdapter;
  }
}
