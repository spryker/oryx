import { IdentityService } from '@spryker-oryx/auth';
import { inject, OnDestroy } from '@spryker-oryx/di';
import {
  BehaviorSubject,
  filter,
  map,
  merge,
  Observable,
  shareReplay,
  skip,
  Subject,
  Subscription,
  switchMap,
  take,
  tap,
  using,
} from 'rxjs';
import { Address } from '../models';
import { AddressAdapter } from './adapter';
import { AddressService } from './address.service';

export class DefaultAddressService implements AddressService, OnDestroy {
  protected addressesState$ = new BehaviorSubject<Address[] | null>(null);
  protected reloadAddress$ = new Subject();
  protected resetSubscription?: Subscription;

  protected addressesLoading$ = merge(
    this.reloadAddress$,
    this.addressesState$.pipe(filter((addresses) => addresses === null))
  ).pipe(
    switchMap(() => this.adapter.getAll()),
    tap((addresses) => {
      this.addressesState$.next(addresses?.length ? addresses : []);
      // reset address state, when user will log in or log out
      this.initReset();
    })
  );

  protected addresses$ = using(
    () => this.addressesLoading$.subscribe(),
    () => this.addressesState$
  ).pipe(shareReplay({ bufferSize: 1, refCount: true }));

  protected currentAddress$ = this.addresses$.pipe(
    map(
      (addresses) =>
        addresses?.find(
          (address) => address.isDefaultBilling || address.isDefaultShipping
        ) ?? null
    )
  );

  constructor(
    protected adapter = inject(AddressAdapter),
    protected identity = inject(IdentityService)
  ) {}

  getCurrentAddress(): Observable<Address | null> {
    return this.currentAddress$;
  }

  getAddress(addressId: string): Observable<Address | null> {
    return this.getAddresses().pipe(
      map((addresses) => addresses?.find(({ id }) => id === addressId) ?? null)
    );
  }

  getAddresses(): Observable<Address[] | null> {
    return this.addresses$;
  }

  addAddress(data: Address): Observable<unknown> {
    return this.adapter
      .add(data)
      .pipe(tap(() => this.reloadAddress$.next(true)));
  }

  updateAddress(data: Address): Observable<unknown> {
    return this.adapter
      .update(data)
      .pipe(tap(() => this.reloadAddress$.next(true)));
  }

  deleteAddress(data: Address): Observable<unknown> {
    return this.adapter
      .delete(data)
      .pipe(tap(() => this.reloadAddress$.next(true)));
  }

  protected initReset(): void {
    this.resetSubscription = this.identity
      .get()
      .pipe(
        skip(1),
        take(1),
        tap(() => {
          this.addressesState$.next(null);
          this.resetSubscription = undefined;
        })
      )
      .subscribe();
  }

  onDestroy(): void {
    this.resetSubscription?.unsubscribe();
  }
}
