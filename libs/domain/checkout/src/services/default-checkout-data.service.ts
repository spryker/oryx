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

export class DefaultCheckoutDataService
  implements CheckoutDataService<CheckoutData, Checkout>
{
  constructor(
    protected adapter = inject(CheckoutAdapter),
    protected cartService = inject(CartService),
    protected storage = inject(StorageService)
  ) {
    this.restore();
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
                  valid: true,
                });
              }
            });
            this.subject.next(map);
          }
        })
      )
      .subscribe();
  }

  protected subject = new BehaviorSubject<
    Map<
      keyof Checkout,
      { valid: boolean; data: Checkout[keyof Checkout] | null }
    >
  >(new Map());

  // protected collected = new Map<
  //   keyof Checkout,
  //   { valid: boolean; data: Checkout[keyof Checkout] | null }
  // >();

  protected cartId = this.cartService.getCart().pipe(
    map((cart) => cart?.id),
    tap((cartId) => {
      const data = cartId ?? null;
      this.select('cartId', data, !!data);
      // this.collected.set('cartId', { data, valid: !!cartId });
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
    field: K
  ): Observable<CheckoutData[K] | undefined> {
    return this.load$.pipe(
      map((data) => data?.[field] as CheckoutData[K] | undefined)
    );
  }

  select<K extends keyof Checkout>(
    key: K,
    data: Checkout[K] | null,
    valid: boolean
  ): void {
    const collected = this.subject.value;
    collected.set(key, { data, valid });
    this.subject.next(collected);
    this.storage.set(
      checkoutDataStorageKey,
      this.merge(collected),
      StorageType.SESSION
    );
  }

  /**
   * resolves the selected data for the given key from the collected data
   */
  selected<K extends keyof Checkout>(key: K): Observable<Checkout[K] | null> {
    return this.subject.pipe(
      map((collected) => collected.get(key)?.data as Checkout[K] | null)
    );
    // return this.storage
    //   .get<Checkout>(checkoutDataStorageKey, StorageType.SESSION)
    //   .pipe(
    //     tap((stored) => {
    //       console.log('stored', stored, key);
    //       if (stored?.[key])
    //         this.collected.set(key, { data: stored[key], valid: true });
    //     }),
    //     switchMap(() =>
    //       this.subject.pipe(
    //         map((collected) => collected.get(key)?.data as Checkout[K] | null)
    //       )
    //     )
    //   );

    // const stored = this.storage.get(checkoutDataStorageKey, StorageType.SESSION);
    // return of((this.collected.get(key)?.data ?? null) as Checkout[K] | null);
  }

  // protected store(): void {
  //   // collect all data
  //   console.log(this.merge());
  //   this.storage.set(checkoutDataStorageKey, this.merge(), StorageType.SESSION);
  // }

  protected merge(
    collected: Map<
      keyof Checkout,
      { valid: boolean; data: Checkout[keyof Checkout] | null }
    >
  ): Checkout {
    const result: Checkout = {} as Checkout; // create an empty object of type T
    collected.forEach((item, key) => {
      if (item.valid && item.data) {
        Object.assign(result, { [key]: item.data });
      }
    });
    return result;
  }
}
