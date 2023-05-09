import { CartService } from '@spryker-oryx/cart';
import { StorageService, StorageType } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  shareReplay,
  switchMap,
  take,
  tap,
} from 'rxjs';
import {
  ApiCheckoutModel,
  Checkout,
  CheckoutData,
  checkoutDataStorageKey,
} from '../models';
import { CheckoutAdapter } from './adapter';
import { CheckoutDataService } from './checkout-data.service';

// TODO: on logout, we should clear the data (could be part of logout -> storage)
export class DefaultCheckoutDataService
  implements CheckoutDataService<CheckoutData, Checkout>
{
  protected subject = new BehaviorSubject<
    Map<
      keyof Checkout,
      { valid: boolean; data: Checkout[keyof Checkout] | null }
    >
  >(new Map());

  constructor(
    protected adapter = inject(CheckoutAdapter),
    protected cartService = inject(CartService),
    protected storage = inject(StorageService)
  ) {
    this.restore();
  }

  isReady(): Observable<boolean> {
    return this.cartService.isEmpty().pipe(map((isEmpty) => isEmpty === false));
  }

  /**
   * Restores the data from storage.
   *
   * TODO: consider storage strategies
   */
  protected restore(): void {
    this.storage
      .get<Checkout>(checkoutDataStorageKey, StorageType.SESSION)
      .pipe(
        take(1),
        tap((stored) => {
          if (stored) {
            const map = new Map<
              keyof Checkout,
              { data: Checkout[keyof Checkout] | null; valid: boolean }
            >();
            Object.keys(stored).forEach((key) => {
              const entries = Object.entries(stored);
              for (const [key, value] of entries) {
                map.set(key as keyof Checkout, {
                  data: value as Checkout[keyof Checkout] | null,
                  valid: false,
                });
              }
            });
            this.subject.next(map);
          }
        })
      )
      .subscribe();
  }

  protected cartId = this.cartService.getCart({}).pipe(
    map((cart) => cart?.id),
    tap((cartId) => {
      const data = cartId ?? null;
      this.set('cartId', !!data, data);
    })
  );

  protected load$ = this.cartId.pipe(
    switchMap((cartId) =>
      cartId
        ? this.adapter.get({
            cartId,
            // TODO: consider making this configurable by the type of checkout we're using
            include: [
              ApiCheckoutModel.Includes.Shipments,
              ApiCheckoutModel.Includes.ShipmentMethods,
              ApiCheckoutModel.Includes.PaymentMethods,
            ],
          })
        : of(null)
    ),
    // in some cases, when cart is not yet created, we get 422 error from the backend
    catchError(() => of({} as CheckoutData)),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  get<K extends keyof CheckoutData>(
    key: K
  ): Observable<CheckoutData[K] | undefined> {
    return this.load$.pipe(
      map((data) => data?.[key] as CheckoutData[K] | undefined)
    );
  }

  collect(): Observable<Partial<Checkout> | null> {
    return this.subject.pipe(
      map((data) => {
        let invalid = false;
        data.forEach((item) => {
          if (!item.valid) invalid = true;
        });
        return invalid ? null : this.populateData(this.merge(data));
      })
    );
  }

  set<K extends keyof Checkout>(
    key: K,
    valid: boolean,
    data?: Checkout[K] | null
  ): void {
    const collected = this.subject.value;
    const item = collected.get(key);
    if (item) item.valid = valid;
    if (item && data !== undefined) item.data = data;
    if (!item) collected.set(key, { valid, data });

    this.subject.next(collected);
    this.storage.set(
      checkoutDataStorageKey,
      this.merge(collected),
      StorageType.SESSION
    );
  }

  selected<K extends keyof Checkout>(key: K): Observable<Checkout[K] | null> {
    return this.subject.pipe(
      map((data) => {
        if (!data.get(key)) this.set(key, false, null);
        return data.get(key)?.data as Checkout[K] | null;
      })
    );
  }

  protected merge(
    data: Map<
      keyof Checkout,
      { valid: boolean; data: Checkout[keyof Checkout] | null }
    >
  ): Partial<Checkout> {
    const result: Partial<Checkout> = {};
    data.forEach((item, key) => {
      Object.assign(result, { [key]: item.data });
    });
    return result;
  }

  protected populateData(inp: Partial<Checkout>): Partial<Checkout> {
    const data = { ...inp };
    if (data.customer) {
      if (!data.customer.salutation && data.shippingAddress?.salutation)
        data.customer.salutation = data.shippingAddress.salutation;
      if (!data.customer.lastName && data.shippingAddress?.lastName)
        data.customer.lastName = data.shippingAddress.lastName;
      if (!data.customer.firstName && data.shippingAddress?.firstName)
        data.customer.firstName = data.shippingAddress.firstName;
    }
    // tmp: copy the billing address from the shipping address for
    // as long as we have not implemented the component
    data.billingAddress = data.shippingAddress;

    return data;
  }

  clear(): void {
    this.storage.remove(checkoutDataStorageKey, StorageType.SESSION);
    this.subject.next(new Map());
    this.cartService.reload();
  }
}
