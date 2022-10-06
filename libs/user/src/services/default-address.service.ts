import { IdentityService } from '@spryker-oryx/auth';
import { inject } from '@spryker-oryx/injector';
import {
  BehaviorSubject,
  map,
  Observable,
  of,
  skip,
  Subscription,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { Address } from '../models';
import { AddressAdapter } from './adapter';
import { AddressService } from './address.service';

export class DefaultAddressService implements AddressService {
  protected addresses$ = new BehaviorSubject<Address[] | null>(null);
  protected currentAddress$ = new BehaviorSubject<Address | null>(null);
  protected subscription = new Subscription();
  protected userChanged = true;

  constructor(
    protected adapter = inject(AddressAdapter),
    protected identity = inject(IdentityService)
  ) {}

  getCurrentAddress(): Observable<Address | null> {
    return this.currentAddress$.pipe(
      switchMap((address) => {
        if (this.userChanged) {
          return this.loadAddresses().pipe(map((addresses) => address));
        }
        return of(address);
      })
    );
  }

  getAddresses(): Observable<Address[] | null> {
    return this.addresses$.pipe(
      switchMap((addresses) => {
        if (this.userChanged) {
          return this.loadAddresses();
        }
        return of(addresses);
      })
    );
  }

  addAddress(data: Address): Observable<unknown> {
    return this.adapter
      .add(data)
      .pipe(switchMap((address) => this.saveAddress(address)));
  }

  updateAddress(data: Address): Observable<unknown> {
    return this.adapter
      .update(data)
      .pipe(switchMap((address) => this.saveAddress(address)));
  }

  clearCurrentAddress(): Observable<void> {
    this.adapter.clear();
    this.currentAddress$.next(null);
    return of(undefined);
  }

  onDestroy(): void {
    this.subscription.unsubscribe();
  }

  protected initSubscriptions(): void {
    // TODO - authService.isAuthenticated() still has race condition weirdness
    // using identity.get() for now
    this.userChanged = false;
    const loadAddressesSubs = this.identity
      .get()
      .pipe(
        skip(1),
        switchMap(() => {
          this.clearCurrentAddress();
          return of(null);
        }),
        take(1),
        tap(() => {
          this.userChanged = true;
        })
      )
      .subscribe();
    this.subscription.add(loadAddressesSubs);
  }

  protected loadAddresses(): Observable<Address[]> {
    this.initSubscriptions();
    return this.adapter.getAll().pipe(
      switchMap((addresses) => {
        this.addresses$.next(addresses);
        if (!addresses || !addresses.length) {
          return of([]);
        }

        for (let i = 0; i < addresses.length; i++) {
          const address = addresses[i];
          if (address.isDefaultBilling || address.isDefaultShipping) {
            this.currentAddress$.next(address);
            break;
          }
        }
        return of(addresses);
      })
    );
  }

  protected saveAddress(address: Address): Observable<void> {
    if (address.isDefaultBilling || address.isDefaultShipping) {
      this.currentAddress$.next(address);
    }
    return of(undefined);
  }
}
