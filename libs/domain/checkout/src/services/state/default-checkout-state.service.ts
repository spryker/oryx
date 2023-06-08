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
import { Checkout, checkoutDataStorageKey } from '../../models';
import { CheckoutStateService } from './checkout-state.service';

type CheckoutValue = {
  valid?: boolean;
  value?: Partial<Checkout[keyof Checkout]> | null;
};

export class DefaultCheckoutStateService implements CheckoutStateService {
  protected subject = new BehaviorSubject<Map<keyof Checkout, CheckoutValue>>(
    new Map()
  );

  constructor(protected storage = inject(StorageService)) {
    this.restore();
  }

  set<K extends keyof Checkout>(
    key: K,
    item: {
      valid?: boolean;
      value?: Partial<Checkout[K]> | null;
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

  get<K extends keyof Checkout>(key: K): Observable<Checkout[K] | null> {
    return this.subject.pipe(
      map((data) => {
        if (!data.get(key)) this.set(key, {});
        return (data.get(key)?.value ?? null) as Checkout[K] | null;
      }),
      distinctUntilChanged()
    );
  }

  clear(): void {
    this.storage.remove(checkoutDataStorageKey, StorageType.Session);
    this.subject.next(new Map());
  }

  getAll(): Observable<Partial<Checkout> | null> {
    return this.subject.pipe(
      map((data) => {
        if (Array.from(data).find((item) => !item[1].valid)) return null;
        const result: Partial<Checkout> = {};
        data.forEach((item, key) => {
          Object.assign(result, { [key]: item.value });
        });
        return this.populateData(result);
      })
    );
  }

  protected populateData(data: Partial<Checkout>): Partial<Checkout> {
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

  /**
   * Restores the data from storage
   */
  protected restore(): void {
    this.storage
      .get<Map<keyof Checkout, CheckoutValue>>(
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
