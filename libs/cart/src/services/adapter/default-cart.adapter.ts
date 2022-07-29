/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { HttpService, JsonAPITransformerService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/injector';
import { Observable, switchMap } from 'rxjs';
import { ApiCartModel, Cart } from '../../models';
import { UserData } from '../user.service';
import {
  AddCartEntityProps,
  CartAdapter,
  DeleteCartEntityProps,
  GetCartProps,
  UpdateCartEntityProps,
} from './cart.adapter';
import { CartNormalizers, CartsNormalizers } from './normalizers';

export class DefaultCartAdapter implements CartAdapter {
  private guestCarts = 'guest-carts';
  private guestCartItems = 'guest-cart-items';

  constructor(
    protected http = inject(HttpService),
    protected SCOS_BASE_URL = inject('SCOS_BASE_URL'),
    protected transformer = inject(JsonAPITransformerService)
  ) {}

  getAll(user: UserData): Observable<Cart[]> {
    const url = this.generateUrl(this.guestCarts);
    const options = {
      headers: this.getHeaders(user),
    };

    return this.http
      .get<ApiCartModel.ResponseList>(url, options)
      .pipe(
        switchMap((response) =>
          this.transformer.transform<Cart[]>(response, CartsNormalizers)
        )
      );
  }

  get(data: GetCartProps): Observable<Cart> {
    const url = this.generateUrl([this.guestCarts, data.cartId].join('/'));
    const options = {
      headers: this.getHeaders(data.user),
    };

    return this.http
      .get<ApiCartModel.Response>(url, options)
      .pipe(
        switchMap((response) =>
          this.transformer.transform<Cart>(response, CartNormalizers)
        )
      );
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
      .post<ApiCartModel.Response>(url, body, options)
      .pipe(
        switchMap((response) =>
          this.transformer.transform<Cart>(response, CartNormalizers)
        )
      );
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
      .patch<ApiCartModel.Response>(url, body, options)
      .pipe(
        switchMap((response) =>
          this.transformer.transform<Cart>(response, CartNormalizers)
        )
      );
  }

  deleteEntry(data: DeleteCartEntityProps): Observable<unknown> {
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

  protected generateUrl(path: string, isIncludesAdded = true): string {
    return `${this.SCOS_BASE_URL}/${path}${
      isIncludesAdded ? `?include=${this.getIncludes()}` : ''
    }`;
  }

  protected getIncludes(): string {
    return Object.values(ApiCartModel.Includes).join(',');
  }

  // ToDo: create some abstract class for getting request headers
  protected getHeaders(user: UserData): Record<string, string> {
    return {
      ...(user.anonymousUserId
        ? { 'X-Anonymous-Customer-Unique-Id': user.anonymousUserId }
        : {}),
    };
  }
}
