/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { AuthIdentity, IdentityService } from '@spryker-oryx/auth';
import { HttpService, JsonAPITransformerService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import {
  CurrencyService,
  PriceModeService,
  StoreService,
} from '@spryker-oryx/site';
import {
  Observable,
  combineLatest,
  map,
  of,
  switchMap,
  take,
  throwError,
} from 'rxjs';
import {
  AddCartEntryQualifier,
  ApiCartModel,
  Cart,
  CartEntryQualifier,
  CartQualifier,
  UpdateCartEntryQualifier,
  UpdateCartPriceModeQualifier,
} from '../../models';
import { CartAdapter } from './cart.adapter';
import { CartNormalizer, CartsNormalizer } from './normalizers';

export class DefaultCartAdapter implements CartAdapter {
  constructor(
    protected http = inject(HttpService),
    protected SCOS_BASE_URL = inject('SCOS_BASE_URL'),
    protected transformer = inject(JsonAPITransformerService),
    protected identity = inject(IdentityService),
    protected store = inject(StoreService),
    protected currency = inject(CurrencyService),
    protected priceMode = inject(PriceModeService)
  ) {}

  getAll(): Observable<Cart[]> {
    return this.identity.get().pipe(
      take(1),
      switchMap((identity) => {
        const url = this.generateUrl(
          identity.isAuthenticated
            ? `${ApiCartModel.UrlParts.Customers}/${identity.userId}/${ApiCartModel.UrlParts.Carts}`
            : ApiCartModel.UrlParts.GuestCarts,
          !identity.isAuthenticated
        );

        return this.http
          .get<ApiCartModel.ResponseList>(url)
          .pipe(this.transformer.do(CartsNormalizer));
      })
    );
  }

  get(data: CartQualifier): Observable<Cart> {
    if (!data.cartId) return throwError(() => new Error('Cart ID is required'));

    return this.identity.get().pipe(
      take(1),
      switchMap((identity) => {
        const url = this.generateUrl(
          `${
            identity.isAuthenticated
              ? ApiCartModel.UrlParts.Carts
              : ApiCartModel.UrlParts.GuestCarts
          }/${data.cartId}`,
          !identity.isAuthenticated
        );

        return this.http
          .get<ApiCartModel.Response>(url)
          .pipe(this.transformer.do(CartNormalizer));
      })
    );
  }

  updateCartPriceMode(data: UpdateCartPriceModeQualifier): Observable<Cart> {
    const attributes = {
      priceMode: data.priceMode,
    };

    return this.identity.get().pipe(
      take(1),
      switchMap((identity) => {
        const url = this.generateUrl(
          `${
            identity.isAuthenticated
              ? ApiCartModel.UrlParts.Carts
              : ApiCartModel.UrlParts.GuestCarts
          }/${data.cartId}`,
          !identity.isAuthenticated
        );

        const body = {
          data: {
            type: identity.isAuthenticated
              ? ApiCartModel.UrlParts.Carts
              : ApiCartModel.UrlParts.GuestCarts,
            attributes,
          },
        };

        return this.http
          .patch<ApiCartModel.Response>(url, body)
          .pipe(this.transformer.do(CartNormalizer));
      })
    );
  }

  addEntry(data: AddCartEntryQualifier): Observable<Cart> {
    const attributes = {
      sku: data.sku,
      quantity: data.quantity,
    };

    return this.identity.get().pipe(
      take(1),
      switchMap((identity) => this.createCartIfNeeded(identity, data.cartId)),
      switchMap(([identity, cartId]) => {
        const url = cartId
          ? this.generateUrl(
              identity.isAuthenticated
                ? `${ApiCartModel.UrlParts.Carts}/${cartId}/${ApiCartModel.UrlParts.Items}`
                : `${ApiCartModel.UrlParts.GuestCarts}/${cartId}/${ApiCartModel.UrlParts.GuestCartItems}`,
              !identity.isAuthenticated
            )
          : this.generateUrl(
              ApiCartModel.UrlParts.GuestCartItems,
              !identity.isAuthenticated
            );

        const body = {
          data: {
            type: identity.isAuthenticated
              ? ApiCartModel.UrlParts.Items
              : ApiCartModel.UrlParts.GuestCartItems,
            attributes,
          },
        };

        return this.http
          .post<ApiCartModel.Response>(url, body)
          .pipe(this.transformer.do(CartNormalizer));
      })
    );
  }

  protected createCartIfNeeded(
    identity: AuthIdentity,
    cartId: string | undefined
  ): Observable<[AuthIdentity, string | undefined]> {
    if (!identity.isAuthenticated || cartId) {
      return of([identity, cartId]);
    }

    // if we are a registered user and we do not have a cartId, we need to create a cart first
    return combineLatest([
      this.store.get(),
      this.currency.get(),
      this.priceMode.get(),
    ]).pipe(
      take(1),
      switchMap(([store, currency, priceMode]) =>
        this.http.post<ApiCartModel.Response>(
          `${this.SCOS_BASE_URL}/${ApiCartModel.UrlParts.Carts}`,
          {
            data: {
              type: 'carts',
              attributes: {
                name: 'My Cart',
                priceMode: priceMode,
                currency: currency,
                store: store?.id,
              },
            },
          }
        )
      ),
      this.transformer.do(CartNormalizer),
      map((result) => [identity, result.id])
    );
  }

  updateEntry(data: UpdateCartEntryQualifier): Observable<Cart> {
    const attributes = {
      quantity: data.quantity,
    };

    return this.identity.get().pipe(
      take(1),
      switchMap((identity) => {
        const url = this.generateUrl(
          identity.isAuthenticated
            ? `${ApiCartModel.UrlParts.Carts}/${data.cartId}/${ApiCartModel.UrlParts.Items}/${data.groupKey}`
            : `${ApiCartModel.UrlParts.GuestCarts}/${data.cartId}/${ApiCartModel.UrlParts.GuestCartItems}/${data.groupKey}`,
          !identity.isAuthenticated
        );
        const body = {
          data: {
            type: identity.isAuthenticated
              ? ApiCartModel.UrlParts.Items
              : ApiCartModel.UrlParts.GuestCartItems,
            attributes,
          },
        };

        return this.http
          .patch<ApiCartModel.Response>(url, body)
          .pipe(this.transformer.do(CartNormalizer));
      })
    );
  }

  deleteEntry(data: CartEntryQualifier): Observable<unknown> {
    return this.identity.get().pipe(
      take(1),
      switchMap((identity) => {
        const url = this.generateUrl(
          identity.isAuthenticated
            ? `${ApiCartModel.UrlParts.Carts}/${data.cartId}/${ApiCartModel.UrlParts.Items}/${data.groupKey}`
            : `${ApiCartModel.UrlParts.GuestCarts}/${data.cartId}/${ApiCartModel.UrlParts.GuestCartItems}/${data.groupKey}`,
          !identity.isAuthenticated
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
