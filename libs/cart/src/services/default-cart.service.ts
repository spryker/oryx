/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { HttpErrorResponse } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/injector';
import {
  catchError,
  combineLatest,
  map,
  mapTo,
  Observable,
  of,
  ReplaySubject,
  switchMap,
  take,
  tap,
} from 'rxjs';
import {
  AddCartEntryQualifier,
  Cart,
  CartEntry,
  CartQualifier,
  CartTotals,
  DeleteCartEntryQualifier,
  LoadCartsQualifier,
  UpdateCartEntryQualifier,
} from '../models';
import { CartAdapter } from './adapter/cart.adapter';
import { CartService, STATE } from './cart.service';
import { UserService } from './user.service';

export class DefaultCartService implements CartService {
  protected carts = new Map<string, STATE>();

  protected activeCartId$ = new ReplaySubject<string | null>(1);
  protected activeCart$ = this.activeCartId$.pipe(
    switchMap((id) =>
      this.carts.has(id!) ? this.carts.get(id!)!.value$ : of(null)
    )
  );
  protected activeCartError$ = this.activeCartId$.pipe(
    switchMap((id) =>
      this.carts.has(id!) ? this.carts.get(id!)!.error$ : of(null)
    )
  );

  constructor(
    protected adapter = inject(CartAdapter),
    protected userService = inject(UserService)
  ) {}

  // ToDo: implement such methods for multi-cart behavior
  /** get all carts (multi-cart) */
  // getCarts() {}
  /** creates a new cart */
  // create() {}
  /** deletes existing cart */
  // remove() {}

  load(data?: LoadCartsQualifier): void {
    if (data?.forceReload || this.carts.size === 0) {
      this.loadCarts();
    }
  }

  getCart(data?: CartQualifier): Observable<Cart | null> {
    if (this.carts.size === 0) {
      this.loadCarts();
    }

    if (data?.cartId && this.carts.has(data.cartId)) {
      return this.carts.get(data.cartId)!.value$;
    }

    return this.activeCart$;
  }

  getCartError(data?: CartQualifier): Observable<HttpErrorResponse | null> {
    if (!data?.cartId) {
      return this.activeCartError$;
    }

    return this.carts.get(data.cartId!)!.error$;
  }

  getTotals(data?: CartQualifier): Observable<CartTotals | null> {
    const cart$ = data?.cartId
      ? this.carts.get(data!.cartId)!.value$
      : this.activeCart$;

    return cart$.pipe(map((cart) => cart?.totals ?? null));
  }

  getEntries(data?: CartQualifier): Observable<CartEntry[] | []> {
    const cart$ = data?.cartId
      ? this.carts.get(data!.cartId)!.value$
      : this.activeCart$;

    return cart$.pipe(map((cart) => cart?.products ?? []));
  }

  addEntry({ cartId, ...attributes }: AddCartEntryQualifier): Observable<null> {
    this.load();
    return combineLatest([this.userService.get(), this.activeCartId$]).pipe(
      take(1),
      switchMap(([userData, activeId]) =>
        this.adapter.addEntry({
          user: userData,
          cartId: cartId ?? activeId!,
          attributes,
        })
      ),
      tap((cart) => {
        const isNoCarts = this.carts.size === 0;
        const cartData = this.carts.get(cart.id);

        if (!cartData) {
          this.addCartToMap(cart);
        } else {
          cartData.value$.next(cart);
        }

        if (isNoCarts) {
          this.activeCartId$.next(cart.id);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        this.updateError(error, cartId);

        throw error;
      }),
      mapTo(null)
    );
  }

  deleteEntry({
    cartId,
    groupKey,
  }: DeleteCartEntryQualifier): Observable<null> {
    this.load();
    return combineLatest([this.userService.get(), this.activeCartId$]).pipe(
      take(1),
      switchMap(([userData, activeId]) =>
        this.adapter
          .deleteEntry({
            user: userData,
            cartId: cartId ?? activeId!,
            groupKey,
          })
          .pipe(
            switchMap(() =>
              this.adapter.get({
                user: userData,
                cartId: cartId ?? activeId!,
              })
            )
          )
      ),
      tap((cart) => {
        const cachedCart = this.carts.get(cart.id)!;

        cachedCart.value$.next(cart);
      }),
      catchError((error: HttpErrorResponse) => {
        this.updateError(error, cartId);

        throw error;
      }),
      mapTo(null)
    );
  }

  updateEntry({
    cartId,
    groupKey,
    ...attributes
  }: UpdateCartEntryQualifier): Observable<null> {
    this.load();
    return combineLatest([this.userService.get(), this.activeCartId$]).pipe(
      take(1),
      switchMap(([userData, activeId]) =>
        this.adapter.updateEntry({
          groupKey,
          user: userData,
          cartId: cartId ?? activeId!,
          attributes,
        })
      ),
      tap((cart) => {
        const cachedCart = this.carts.get(cart.id)!;

        cachedCart.value$.next(cart);
      }),
      catchError((error: HttpErrorResponse) => {
        this.updateError(error, cartId);

        throw error;
      }),
      mapTo(null)
    );
  }

  protected loadCarts(): void {
    this.userService
      .get()
      .pipe(
        take(1),
        switchMap((userData) => this.adapter.getAll(userData))
      )
      .subscribe({
        next: (carts) => {
          const isCartsEmpty = this.carts.size === 0;

          if (!carts?.length) {
            this.activeCartId$.next(null);

            return;
          }

          carts.forEach((cart) => {
            this.addCartToMap(cart);

            if (isCartsEmpty && cart.isDefault) {
              this.activeCartId$.next(cart.id);
            }
          });
        },
      });
  }

  protected updateError(error: HttpErrorResponse, cartId?: string): void {
    this.activeCartId$.pipe(take(1)).subscribe((activeCartId) => {
      const id = cartId ?? activeCartId!;
      const cachedCart = this.carts.get(id)!;

      cachedCart.error$.next(error);
    });
  }

  protected addCartToMap(cart: Cart): void {
    const value$ = new ReplaySubject<Cart | null>(1);

    this.carts.set(cart.id, {
      value$,
      error$: new ReplaySubject(1),
    });

    value$.next(cart);
  }
}
