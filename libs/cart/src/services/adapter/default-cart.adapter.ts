/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { HttpService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/injector';
import { map, Observable } from 'rxjs';
import { Cart } from '../../models';
import { UserData } from '../user.service';
import {
  AddCartEntityProps,
  CartAdapter,
  CartIncludes,
  CartResponse,
  CART_INCLUDES,
  DeleteCartEntityProps,
  GetCartProps,
  GlueCart,
  GlueCartsList,
  UpdateCartEntityProps,
} from './cart.adapter';

export class DefaultCartAdapter implements CartAdapter {
  private carts = 'carts';
  private cartItems = 'items';
  private guestCarts = 'guest-carts';
  private guestCartItems = 'guest-cart-items';

  constructor(
    protected http = inject(HttpService),
    protected SCOS_BASE_URL = inject('SCOS_BASE_URL')
  ) {}

  getAll(user: UserData): Observable<Cart[]> {
    const url = this.generateUrl(this.guestCarts);
    const options = {
      headers: this.getHeaders(user),
    };

    return this.http
      .get<GlueCartsList>(url, options)
      .pipe(map((response) => this.normalize(response)));
  }

  get(data: GetCartProps): Observable<Cart> {
    const url = this.generateUrl([this.guestCarts, data.cartId].join('/'));
    const options = {
      headers: this.getHeaders(data.user),
    };

    return this.http
      .get<GlueCart>(url, options)
      .pipe(map((response) => this.normalize(response)));
  }

  addEntry(data: AddCartEntityProps): Observable<Cart> {
    const url = data.cartId
      ? this.generateUrl(
          [this.guestCarts, data.cartId, this.guestCartItems].join('/')
        )
      : this.generateUrl(this.guestCartItems);

    const body = {
      data: {
        type: this.guestCartItems,
        attributes: data.attributes,
      },
    };
    const options = {
      headers: this.getHeaders(data.user),
    };

    return this.http
      .post<GlueCart>(url, body, options)
      .pipe(map((response) => this.normalize(response)));
  }

  updateEntry(data: UpdateCartEntityProps): Observable<Cart> {
    const url = this.generateUrl(
      [this.guestCarts, data.cartId, this.guestCartItems, data.groupKey].join(
        '/'
      )
    );
    const body = {
      data: {
        type: this.guestCartItems,
        attributes: data.attributes,
      },
    };
    const options = {
      headers: this.getHeaders(data.user),
    };

    return this.http
      .patch<GlueCart>(url, body, options)
      .pipe(map((response) => this.normalize(response)));
  }

  deleteEntry(data: DeleteCartEntityProps): Observable<null> {
    const url = this.generateUrl(
      [this.guestCarts, data.cartId, this.guestCartItems, data.groupKey].join(
        '/'
      )
    );
    const options = {
      headers: this.getHeaders(data.user),
    };

    return this.http.delete(url, options);
  }

  protected normalizedCart(
    cart: CartResponse,
    included: CartIncludes[] | undefined
  ): Cart {
    return {
      id: cart.id,
      ...cart.attributes,
      ...(included && {
        products: cart.relationships![CART_INCLUDES.GUEST_CART_ITEMS].data.map(
          ({ id: relationId, type }) => {
            const { id, attributes } = included.find(
              (include) => include.id === relationId && include.type === type
            )!;

            return {
              id,
              ...attributes,
            };
          }
        ),
      }),
    };
  }

  protected normalize(response: GlueCart): Cart;
  protected normalize(response: GlueCartsList): Cart[];
  protected normalize(response: GlueCartsList | GlueCart): Cart[] | Cart {
    if (Array.isArray(response.data)) {
      return response.data.map((cart) =>
        this.normalizedCart(cart, response.included)
      );
    }

    return this.normalizedCart(response.data, response.included);
  }

  protected generateUrl(path: string, isIncludesAdded = true): string {
    return `${this.SCOS_BASE_URL}/${path}/${
      isIncludesAdded ? `?include=${this.getIncludes()}` : ''
    }`;
  }

  private getIncludes(): string {
    return Object.values(CART_INCLUDES).join(',');
  }

  // ToDo: create some abstract class for getting request headers
  private getHeaders(user: UserData): Record<string, string> {
    return {
      ...(user.anonymousUserId
        ? { 'X-Anonymous-Customer-Unique-Id': user.anonymousUserId }
        : {}),
    };
  }
}
