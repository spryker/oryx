/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { IdentityService } from '@spryker-oryx/auth';
import { HttpService, JsonAPITransformerService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/injector';
import { combineLatest, Observable, switchMap, take } from 'rxjs';
import { ApiCartModel, Cart } from '../../models';
import {
  AddCartEntityProps,
  CartAdapter,
  DeleteCartEntityProps,
  GetCartProps,
  UpdateCartEntityProps,
} from './cart.adapter';
import { CartNormalizers, CartsNormalizers } from './normalizers';

export class DefaultCartAdapter implements CartAdapter {
  constructor(
    protected http = inject(HttpService),
    protected SCOS_BASE_URL = inject('SCOS_BASE_URL'),
    protected transformer = inject(JsonAPITransformerService),
    protected identity = inject(IdentityService)
  ) {}

  getAll(): Observable<Cart[]> {
    return combineLatest([
      this.identity.get(),

      this.identity.getHeaders(),
    ]).pipe(
      take(1),
      switchMap(([identity, headers]) => {
        const url = this.generateUrl(
          !identity.anonymous
            ? `${ApiCartModel.UrlParts.Customers}/${identity.id}/${ApiCartModel.UrlParts.Carts}`
            : ApiCartModel.UrlParts.GuestCarts,
          identity.anonymous
        );

        return this.http
          .get<ApiCartModel.ResponseList>(url, { headers })
          .pipe(this.transformer.do(CartsNormalizers));
      })
    );
  }

  get(data: GetCartProps): Observable<Cart> {
    return combineLatest([
      this.identity.get(),
      this.identity.getHeaders(),
    ]).pipe(
      take(1),
      switchMap(([identity, headers]) => {
        const url = this.generateUrl(
          `${
            !identity.anonymous
              ? ApiCartModel.UrlParts.Carts
              : ApiCartModel.UrlParts.GuestCarts
          }/${data.cartId}`,
          identity.anonymous
        );

        return this.http
          .get<ApiCartModel.Response>(url, { headers })
          .pipe(this.transformer.do(CartNormalizers));
      })
    );
  }

  addEntry(data: AddCartEntityProps): Observable<Cart> {
    return combineLatest([
      this.identity.get(),
      this.identity.getHeaders(),
    ]).pipe(
      take(1),
      switchMap(([identity, headers]) => {
        const url = data.cartId
          ? this.generateUrl(
              !identity.anonymous
                ? `${ApiCartModel.UrlParts.Carts}/${data.cartId}/${ApiCartModel.UrlParts.Items}`
                : `${ApiCartModel.UrlParts.GuestCarts}/${data.cartId}/${ApiCartModel.UrlParts.GuestCartItems}`,
              identity.anonymous
            )
          : this.generateUrl(
              ApiCartModel.UrlParts.GuestCartItems,
              identity.anonymous
            );

        const body = {
          data: {
            type: !identity.anonymous
              ? ApiCartModel.UrlParts.Items
              : ApiCartModel.UrlParts.GuestCartItems,
            attributes: data.attributes,
          },
        };

        return this.http
          .post<ApiCartModel.Response>(url, body, { headers })
          .pipe(this.transformer.do(CartNormalizers));
      })
    );
  }

  updateEntry(data: UpdateCartEntityProps): Observable<Cart> {
    return combineLatest([
      this.identity.get(),
      this.identity.getHeaders(),
    ]).pipe(
      take(1),
      switchMap(([identity, headers]) => {
        const url = this.generateUrl(
          !identity.anonymous
            ? `${ApiCartModel.UrlParts.Carts}/${data.cartId}/${ApiCartModel.UrlParts.Items}/${data.groupKey}`
            : `${ApiCartModel.UrlParts.GuestCarts}/${data.cartId}/${ApiCartModel.UrlParts.GuestCartItems}/${data.groupKey}`,
          identity.anonymous
        );
        const body = {
          data: {
            type: !identity.anonymous
              ? ApiCartModel.UrlParts.Items
              : ApiCartModel.UrlParts.GuestCartItems,
            attributes: data.attributes,
          },
        };

        return this.http
          .patch<ApiCartModel.Response>(url, body, { headers })
          .pipe(this.transformer.do(CartNormalizers));
      })
    );
  }

  deleteEntry(data: DeleteCartEntityProps): Observable<unknown> {
    return combineLatest([
      this.identity.get(),
      this.identity.getHeaders(),
    ]).pipe(
      take(1),
      switchMap(([identity, headers]) => {
        const url = this.generateUrl(
          !identity.anonymous
            ? `${ApiCartModel.UrlParts.Carts}/${data.cartId}/${ApiCartModel.UrlParts.Items}/${data.groupKey}`
            : `${ApiCartModel.UrlParts.GuestCarts}/${data.cartId}/${ApiCartModel.UrlParts.GuestCartItems}/${data.groupKey}`,
          identity.anonymous
        );

        return this.http.delete(url, { headers });
      })
    );
  }

  protected generateUrl(path: string, isAnonymous: boolean): string {
    const includes = isAnonymous
      ? [ApiCartModel.Includes.GuestCartItems]
      : [ApiCartModel.Includes.Items];

    return `${this.SCOS_BASE_URL}/${path}${`?include=${includes.join(',')}`}`;
  }
}
