import { StorageService, StorageType } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import {
  BehaviorSubject,
  distinctUntilChanged,
  map,
  Observable,
  take,
  tap,
} from 'rxjs';
import { checkoutDataStorageKey, PlaceOrderData } from '../../models';
import { CheckoutStateService } from './checkout-state.service';

type CheckoutValue = {
  valid?: boolean;
  value?: Partial<PlaceOrderData[keyof PlaceOrderData]> | null;
};

export class DefaultCheckoutStateService implements CheckoutStateService {
  protected subject = new BehaviorSubject<
    Map<keyof PlaceOrderData, CheckoutValue>
  >(new Map());

  protected isInvalid$ = new BehaviorSubject<boolean>(false);

  constructor(protected storage = inject(StorageService)) {
    this.restore();
  }

  set<K extends keyof PlaceOrderData>(
    key: K,
    item: {
      valid?: boolean;
      value?: Partial<PlaceOrderData[K]> | null;
    }
  ): void {
    const collected = this.subject.value;
    const existing = collected.get(key);
    if (existing && item.valid !== undefined) existing.valid = item.valid;
    if (existing && item.value !== undefined) existing.value = item.value;
    if (!existing) collected.set(key, item);
    this.subject.next(collected);
    this.storage.set(
      checkoutDataStorageKey,
      Array.from(collected),
      StorageType.Session
    );
  }

  get<K extends keyof PlaceOrderData>(
    key: K
  ): Observable<PlaceOrderData[K] | null> {
    return this.subject.pipe(
      map((data) => {
        if (!data.get(key)) this.set(key, {});
        return (data.get(key)?.value ?? null) as PlaceOrderData[K] | null;
      }),
      distinctUntilChanged()
    );
  }

  clear(): void {
    this.storage.remove(checkoutDataStorageKey, StorageType.Session);
    this.isInvalid$.next(false);
    this.subject.next(new Map());
  }

  getAll(complete = true): Observable<Partial<PlaceOrderData> | null> {
    return this.subject.pipe(
      map((data) => {
        if (complete && Array.from(data).find((item) => !item[1].valid)) {
          this.isInvalid$.next(true);
          return null;
        } else {
          this.isInvalid$.next(false);
        }

        const result: Partial<PlaceOrderData> = {};
        data.forEach((item, key) => {
          Object.assign(result, { [key]: item.value });
        });
        return this.populateData(result);
      })
    );
  }

  isInvalid(): Observable<boolean> {
    return this.isInvalid$.pipe(distinctUntilChanged());
  }

  protected populateData(
    data: Partial<PlaceOrderData>
  ): Partial<PlaceOrderData> {
    if (data.customer) {
      if (!data.customer.salutation && data.shippingAddress?.salutation)
        data.customer.salutation = data.shippingAddress.salutation;
      if (!data.customer.lastName && data.shippingAddress?.lastName)
        data.customer.lastName = data.shippingAddress.lastName;
      if (!data.customer.firstName && data.shippingAddress?.firstName)
        data.customer.firstName = data.shippingAddress.firstName;
    }
    return data;
  }

  /**
   * Restores the data from storage
   */
  protected restore(): void {
    this.storage
      .get<Map<keyof PlaceOrderData, CheckoutValue>>(
        checkoutDataStorageKey,
        StorageType.Session
      )
      .pipe(
        take(1),
        tap((stored) => this.subject.next(new Map(stored)))
      )
      .subscribe();
  }
}
