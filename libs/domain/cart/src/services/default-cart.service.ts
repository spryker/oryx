/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { IdentityService } from '@spryker-oryx/auth';
import { HttpErrorResponse } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { invokable } from '@spryker-oryx/utilities';
import {
  BehaviorSubject,
  catchError,
  map,
  mapTo,
  Observable,
  of,
  ReplaySubject,
  Subscription,
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
  UpdateCartEntryQualifier,
} from '../models';
import { CartAdapter } from './adapter/cart.adapter';
import { CartService, STATE } from './cart.service';

export class DefaultCartService implements CartService {
  protected loading$ = new BehaviorSubject(false);
  protected carts = new Map<string, STATE>();
  protected subscription = new Subscription();
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
    protected identity = inject(IdentityService)
  ) {
    this.initSubscriptions();
  }

  protected initSubscriptions(): void {
    this.loading$.next(true);

    const loadCartsSubs = this.identity
      .get()
      .pipe(
        switchMap(() => this.loadCarts()),
        tap(() => this.loading$.next(false))
      )
      .subscribe();

    this.subscription.add(loadCartsSubs);
  }

  protected loadCarts(): Observable<void> {
    return this.adapter.getAll().pipe(
      map((carts) => {
        this.carts.clear();

        if (carts === null) {
          this.activeCartId$.next(null);

          return;
        }

        carts.forEach((cart) => {
          this.addCartToMap(cart);

          if (cart.isDefault) {
            this.activeCartId$.next(cart.id);
          }
        });
      })
    );
  }

  getLoadingState(): Observable<boolean> {
    return this.loading$;
  }

  load(): Observable<null> {
    return invokable(
      this.identity.get().pipe(
        take(1),
        switchMap(() => this.loadCarts()),
        mapTo(null)
      )
    );
  }

  onDestroy(): void {
    this.subscription.unsubscribe();
    this.loading$.next(false);
    this.loading$.complete();
  }

  // ToDo: implement such methods for multi-cart behavior
  /** get all carts (multi-cart) */
  // getCarts() {}
  /** creates a new cart */
  // create() {}
  /** deletes existing cart */
  // remove() {}

  getCart(data?: CartQualifier): Observable<Cart | null> {
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

  getEntries(data?: CartQualifier): Observable<CartEntry[]> {
    const cart$ = data?.cartId
      ? this.carts.get(data!.cartId)!.value$
      : this.activeCart$;

    return cart$.pipe(map((cart) => cart?.products ?? []));
  }

  isEmpty(data?: CartQualifier): Observable<boolean> {
    return this.getEntries(data).pipe(map((entries) => !entries?.length));
  }

  addEntry({ cartId, ...attributes }: AddCartEntryQualifier): Observable<null> {
    this.loading$.next(true);

    return invokable(
      this.activeCartId$.pipe(
        take(1),
        switchMap((activeId) =>
          this.adapter.addEntry({
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

          this.loading$.next(false);
        }),
        catchError((error: HttpErrorResponse) => {
          this.loading$.next(false);
          this.updateError(error, cartId);
          throw error;
        }),
        mapTo(null)
      )
    );
  }

  deleteEntry({
    cartId,
    groupKey,
  }: DeleteCartEntryQualifier): Observable<null> {
    this.loading$.next(true);

    return invokable(
      this.activeCartId$.pipe(
        take(1),
        switchMap((activeId) =>
          this.adapter
            .deleteEntry({
              cartId: cartId ?? activeId!,
              groupKey,
            })
            .pipe(
              switchMap(() =>
                this.adapter.get({
                  cartId: cartId ?? activeId!,
                })
              )
            )
        ),
        tap((cart) => {
          const cachedCart = this.carts.get(cart.id);
          cachedCart?.value$.next(cart);

          this.loading$.next(false);
        }),
        catchError((error: HttpErrorResponse) => {
          this.loading$.next(false);
          this.updateError(error, cartId);
          throw error;
        }),
        mapTo(null)
      )
    );
  }

  updateEntry({
    cartId,
    groupKey,
    ...attributes
  }: UpdateCartEntryQualifier): Observable<null> {
    this.loading$.next(true);

    return invokable(
      this.activeCartId$.pipe(
        take(1),
        switchMap((activeId) =>
          this.adapter.updateEntry({
            groupKey,
            cartId: cartId ?? activeId!,
            attributes,
          })
        ),
        tap((cart) => {
          const cachedCart = this.carts.get(cart.id)!;

          cachedCart.value$.next(cart);

          this.loading$.next(false);
        }),
        catchError((error: HttpErrorResponse) => {
          this.loading$.next(false);
          this.updateError(error, cartId);
          throw error;
        }),
        mapTo(null)
      )
    );
  }

  protected updateError(error: HttpErrorResponse, cartId?: string): void {
    this.activeCartId$.pipe(take(1)).subscribe((activeCartId) => {
      const id = cartId ?? activeCartId!;
      const cachedCart = this.carts.get(id)!;

      cachedCart?.error$?.next(error);
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
