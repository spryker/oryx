import {
  Cart,
  CartModificationEnd,
  CartQualifier,
  CartQuery,
  CartService,
} from '@spryker-oryx/cart';
import { createQuery, injectQuery } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import {
  Observable,
  combineLatest,
  distinctUntilChanged,
  map,
  of,
  shareReplay,
  skip,
  switchMap,
  take,
  using,
} from 'rxjs';

/* deprecated since 1.1, we should use imports from @spryker-oryx/checkout:
import {
  CheckoutAdapter,
  CheckoutData,
  CheckoutDataService,
  CheckoutStateService,
} from '@spryker-oryx/checkout';
 */
import { CheckoutData } from '../../../src/models';
import {
  CheckoutAdapter,
  CheckoutDataService,
  CheckoutStateService,
} from '../../../src/services';

// TODO: on logout, we should clear the data (could be part of logout -> storage)
export class DefaultCheckoutDataService implements CheckoutDataService {
  protected cartId$ = this.cartService.getCart().pipe(
    map((cart) => cart?.id),
    distinctUntilChanged()
  );

  protected checkoutState$ = this.checkoutState.getAll(false);

  protected query$ = createQuery({
    loader: () =>
      this.cartId$.pipe(
        take(1),
        switchMap((cartId) =>
          cartId ? this.adapter.get({ cartId }) : of(null)
        )
      ),
    resetOn: [this.cartId$.pipe(skip(1))],
  });

  /**
   * Workaround update cart totals and not loose shipments
   */
  protected queryTotalsCartUpdate$ = createQuery({
    loader: () =>
      combineLatest([this.cartId$, this.checkoutState$]).pipe(
        take(1),
        switchMap(([cartId, checkoutState]) => {
          if (!cartId) return of(null);
          return this.adapter.get({ ...checkoutState, cartId });
        })
      ),
    resetOn: [this.cartId$.pipe(skip(1))],
    refreshOn: [CartModificationEnd, this.checkoutState$.pipe(skip(1))],
    onLoad: [
      (data) => {
        const cart = data?.data?.carts?.[0];
        if (cart) {
          // we have the most recent cart data, so we can update the cart query
          this.cartQuery.set({
            data: (current) => ({ ...(current ?? {}), ...cart }),
            qualifier: { cartId: cart.id },
          });
        }
      },
    ],
  })
    .get()
    .pipe(shareReplay({ refCount: true, bufferSize: 1 }));

  constructor(
    protected adapter = inject(CheckoutAdapter),
    protected cartService = inject(CartService),
    protected cartQuery = injectQuery<Cart, CartQualifier>(CartQuery),
    protected checkoutState = inject(CheckoutStateService)
  ) {}

  get<K extends keyof CheckoutData>(
    key: K
  ): Observable<CheckoutData[K] | undefined> {
    const result = this.query$
      .get()
      .pipe(map((data) => data?.[key] as CheckoutData[K] | undefined));

    return using(
      // wire-in cart totals workaround into checkout data subscription
      () => this.queryTotalsCartUpdate$.subscribe(),
      () => result
    );
  }
}
