import { StorageService, StorageType } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { BehaviorSubject, map, Observable, take, tap } from 'rxjs';
import { Checkout, checkoutDataStorageKey } from '../../models';
import { CheckoutStateService } from './checkout-state.service';

export class DefaultCheckoutStateService implements CheckoutStateService {
  protected subject = new BehaviorSubject<
    Map<
      keyof Checkout,
      { valid?: boolean; value?: Partial<Checkout[keyof Checkout]> | null }
    >
  >(new Map());

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
      this.merge(collected),
      StorageType.SESSION
    );
  }

  get<K extends keyof Checkout>(key: K): Observable<Checkout[K] | null> {
    return this.subject.pipe(
      map((data) => {
        if (!data.get(key)) this.set(key, {});
        return data.get(key)?.value as Checkout[K] | null;
      })
    );
  }

  clear(): void {
    this.storage.remove(checkoutDataStorageKey, StorageType.SESSION);
    this.subject.next(new Map());
  }

  getAll(): Observable<Partial<Checkout> | null> {
    return this.subject.pipe(
      map((data) => {
        let invalid = false;
        data.forEach((item) => {
          console.log(item);
          if (!item.valid) invalid = true;
        });
        return invalid ? null : this.populateData(this.merge(data));
      })
    );
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
            Object.keys(stored).forEach(() => {
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

  protected merge(
    data: Map<
      keyof Checkout,
      { valid?: boolean; value?: Partial<Checkout[keyof Checkout]> | null }
    >
  ): Partial<Checkout> {
    const result: Partial<Checkout> = {};
    data.forEach((item, key) => {
      Object.assign(result, { [key]: item.value });
    });
    return result;
  }
}
