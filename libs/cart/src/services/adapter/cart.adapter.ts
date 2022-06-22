import { Observable } from 'rxjs';
import {
  Cart,
  CartAttributes,
  CartEntryAttributes,
  CartEntryAttributesQualifier,
} from '../../models';
import { UserData } from '../user.service';

// ToDo: replace [RELATIONSHIP, INCLUDE, JSON_API_MODEL] with JSON API approach
interface RELATIONSHIP {
  id: string;
  type: string;
}

interface INCLUDE<T, A> {
  type: T;
  id: string;
  attributes: A;
  relationships?: Record<string, Record<'data', RELATIONSHIP[]>>;
}

export interface JSON_API_MODEL<T, I> {
  data: T;
  included?: I;
}

export type CartResponse = INCLUDE<'guest-carts', CartAttributes>;

export type CartIncludes = INCLUDE<
  CART_INCLUDES.GUEST_CART_ITEMS,
  CartEntryAttributes
>;

export type GlueCartsList = JSON_API_MODEL<CartResponse[], CartIncludes[]>;

export type GlueCart = JSON_API_MODEL<CartResponse, CartIncludes[]>;

export enum CART_INCLUDES {
  GUEST_CART_ITEMS = 'guest-cart-items',
}

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

export interface CartAdapter<T = Cart> {
  getAll: (user: UserData) => Observable<T[]>;
  get: (data: GetCartProps) => Observable<T>;
  addEntry: (data: AddCartEntityProps) => Observable<T>;
  deleteEntry: (data: DeleteCartEntityProps) => Observable<null>;
  updateEntry: (data: UpdateCartEntityProps) => Observable<T>;
}

export const CartAdapter = 'FES.CartAdapter';

declare global {
  interface InjectionTokensContractMap {
    [CartAdapter]: CartAdapter;
  }
}
