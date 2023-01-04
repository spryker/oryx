/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { IdentityService } from '@spryker-oryx/auth';
import { HttpService, JsonAPITransformerService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { Observable, switchMap, take } from 'rxjs';
import { ApiCartModel, Cart } from '../../models';
import {
  AddCartEntityProps,
  CartAdapter,
  DeleteCartEntityProps,
  GetCartProps,
  UpdateCartEntityProps,
} from './cart.adapter';
import { CartNormalizer, CartsNormalizer } from './normalizers';

export class DefaultCartAdapter implements CartAdapter {
  constructor(
    protected http = inject(HttpService),
    protected SCOS_BASE_URL = inject('SCOS_BASE_URL'),
    protected transformer = inject(JsonAPITransformerService),
    protected identity = inject(IdentityService)
  ) {}

  getAll(): Observable<Cart[] | null> {
    return this.identity.get().pipe(
      take(1),
      switchMap((identity) => {
        const url = this.generateUrl(
          !identity.anonymous
            ? `${ApiCartModel.UrlParts.Customers}/${identity.id}/${ApiCartModel.UrlParts.Carts}`
            : ApiCartModel.UrlParts.GuestCarts,
          identity.anonymous
        );

        return this.http
          .get<ApiCartModel.ResponseList>(url)
          .pipe(this.transformer.do(CartsNormalizer));
      })
    );
  }

  get(data: GetCartProps): Observable<Cart> {
    return this.identity.get().pipe(
      take(1),
      switchMap((identity) => {
        const url = this.generateUrl(
          `${
            !identity.anonymous
              ? ApiCartModel.UrlParts.Carts
              : ApiCartModel.UrlParts.GuestCarts
          }/${data.cartId}`,
          identity.anonymous
        );

        return this.http
          .get<ApiCartModel.Response>(url)
          .pipe(this.transformer.do(CartNormalizer));
      })
    );
  }

  addEntry(data: AddCartEntityProps): Observable<Cart> {
    return this.identity.get().pipe(
      take(1),
      switchMap((identity) => {
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
          .post<ApiCartModel.Response>(url, body)
          .pipe(this.transformer.do(CartNormalizer));
      })
    );
  }

  updateEntry(data: UpdateCartEntityProps): Observable<Cart> {
    return this.identity.get().pipe(
      take(1),
      switchMap((identity) => {
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
          .patch<ApiCartModel.Response>(url, body)
          .pipe(this.transformer.do(CartNormalizer));
      })
    );
  }

  deleteEntry(data: DeleteCartEntityProps): Observable<unknown> {
    return this.identity.get().pipe(
      take(1),
      switchMap((identity) => {
        const url = this.generateUrl(
          !identity.anonymous
            ? `${ApiCartModel.UrlParts.Carts}/${data.cartId}/${ApiCartModel.UrlParts.Items}/${data.groupKey}`
            : `${ApiCartModel.UrlParts.GuestCarts}/${data.cartId}/${ApiCartModel.UrlParts.GuestCartItems}/${data.groupKey}`,
          identity.anonymous
        );

        return this.http.delete(url);
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
