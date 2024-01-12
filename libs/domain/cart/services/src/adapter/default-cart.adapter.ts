/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { AuthIdentity, IdentityService } from '@spryker-oryx/auth';
import {
  AddCartEntryQualifier,
  ApiCartModel,
  Cart,
  CartAdapter,
  CartEntryQualifier,
  CartFeatureOptionsKey,
  CartNormalizer,
  CartQualifier,
  CartsNormalizer,
  CouponQualifier,
  CreateCartQualifier,
  UpdateCartEntryQualifier,
  UpdateCartQualifier,
} from '@spryker-oryx/cart';
import {
  FeatureOptionsService,
  HttpService,
  JsonAPITransformerService,
} from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import {
  CurrencyService,
  PriceModeService,
  StoreService,
} from '@spryker-oryx/site';
import {
  Observable,
  catchError,
  combineLatest,
  map,
  of,
  switchMap,
  take,
  throwError,
} from 'rxjs';

export class DefaultCartAdapter implements CartAdapter {
  constructor(
    protected http = inject(HttpService),
    protected SCOS_BASE_URL = inject('SCOS_BASE_URL'),
    protected transformer = inject(JsonAPITransformerService),
    protected identity = inject(IdentityService),
    protected store = inject(StoreService),
    protected currency = inject(CurrencyService),
    protected priceMode = inject(PriceModeService),
    protected optionsService = inject(FeatureOptionsService)
  ) {}

  getAll(): Observable<Cart[]> {
    return this.identity.get().pipe(
      take(1),
      switchMap((identity) => {
        if (!identity.isAuthenticated && !identity.userId) return of([]);

        const url = this.generateUrl(
          identity.isAuthenticated
            ? `${ApiCartModel.UrlParts.Customers}/${identity.userId}/${ApiCartModel.UrlParts.Carts}`
            : ApiCartModel.UrlParts.GuestCarts,
          !identity.isAuthenticated
        );

        return this.http.get<ApiCartModel.ResponseList>(url).pipe(
          this.transformer.do(CartsNormalizer),
          catchError(() => of([]))
        );
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

  update(data: UpdateCartQualifier): Observable<Cart> {
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
            attributes: { ...data },
          },
        };

        const options = {
          headers: { 'If-Match': '*' },
        };

        return this.http
          .patch<ApiCartModel.Response>(url, body, options)
          .pipe(this.transformer.do(CartNormalizer));
      })
    );
  }

  delete(data: CartQualifier): Observable<Cart> {
    if (!data.cartId) return throwError(() => new Error('Cart ID is required'));

    return this.http
      .delete<ApiCartModel.Response>(
        `${this.SCOS_BASE_URL}/${ApiCartModel.UrlParts.Carts}/${data.cartId}`
      )
      .pipe(this.transformer.do(CartNormalizer));
  }

  addCoupon(data: CouponQualifier): Observable<Cart> {
    return this.identity.get().pipe(
      take(1),
      switchMap((identity) => this.createCartIfNeeded(identity, data.cartId)),
      switchMap(([identity]) => {
        const url = this.generateUrl(
          identity.isAuthenticated
            ? `${ApiCartModel.UrlParts.Carts}/${data.cartId}/${ApiCartModel.UrlParts.Coupons}`
            : `${ApiCartModel.UrlParts.GuestCarts}/${data.cartId}/${ApiCartModel.UrlParts.Coupons}`,
          !identity.isAuthenticated
        );

        const body = {
          data: {
            type: ApiCartModel.UrlParts.Coupons,
            attributes: {
              code: data.code,
            },
          },
        };

        return this.http
          .post<ApiCartModel.Response>(url, body)
          .pipe(this.transformer.do(CartNormalizer));
      })
    );
  }

  deleteCoupon(data: CouponQualifier): Observable<unknown> {
    return this.identity.get().pipe(
      take(1),
      switchMap((identity) => {
        const requestType = identity.isAuthenticated
          ? ApiCartModel.UrlParts.Carts
          : ApiCartModel.UrlParts.GuestCarts;

        const url = this.generateUrl(
          `${requestType}/${data.cartId}/${ApiCartModel.UrlParts.Coupons}/${data.code}`,
          !identity.isAuthenticated
        );
        return this.http.delete(url);
      })
    );
  }

  addEntry(data: AddCartEntryQualifier): Observable<Cart> {
    const attributes = {
      sku: data.sku,
      quantity: data.quantity,
      productOfferReference: data.offer,
    };

    return this.identity.get({ requireGuest: true }).pipe(
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

  create(qualifier?: CreateCartQualifier): Observable<Cart> {
    const request = (attributes: CreateCartQualifier) =>
      this.http.post<ApiCartModel.Response>(
        `${this.SCOS_BASE_URL}/${ApiCartModel.UrlParts.Carts}`,
        {
          data: {
            type: 'carts',
            attributes,
          },
        }
      );

    return this.store.get().pipe(
      take(1),
      switchMap((store) =>
        qualifier
          ? request({
              store: store?.id,
              ...qualifier,
              name: this.ensureCartName(qualifier),
            })
          : combineLatest([this.currency.get(), this.priceMode.get()]).pipe(
              take(1),
              switchMap(([currency, priceMode]) =>
                request({ store: store?.id, currency, priceMode })
              )
            )
      ),
      this.transformer.do(CartNormalizer)
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
    return this.create().pipe(map(({ id }) => [identity, id]));
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

  protected generateUrl(path: string, isAnonymous?: boolean): string {
    const includes = isAnonymous
      ? [ApiCartModel.Includes.GuestCartItems, ApiCartModel.Includes.Coupons]
      : [ApiCartModel.Includes.Items, ApiCartModel.Includes.Coupons];

    return `${this.SCOS_BASE_URL}/${path}${`?include=${includes.join(',')}`}`;
  }

  protected ensureCartName(
    qualifier?: CreateCartQualifier
  ): string | undefined {
    return this.isMultiCart ? qualifier?.name : undefined;
  }

  protected get isMultiCart(): boolean {
    return !!this.optionsService.getFeatureOptions(CartFeatureOptionsKey)
      ?.multi;
  }
}
