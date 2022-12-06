import { StorageService, StorageType } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/injector';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import {
  Address,
  ContactDetails,
  guestCheckoutStorageKey,
  Shipment,
} from '../models';
import { CheckoutDataService } from './checkout-data.service';

export class DefaultCheckoutDataService implements CheckoutDataService {
  constructor(protected storage = inject(StorageService)) {
    this.getPersistedData();
  }

  protected isGuestCheckout$ = new ReplaySubject<boolean>();
  protected contactDetails$ = new BehaviorSubject<ContactDetails | null>(null);
  protected addressDetails$ = new BehaviorSubject<Address | null>(null);
  protected shipmentDetails$ = new BehaviorSubject<Shipment | null>(null);

  isGuestCheckout(): Observable<boolean> {
    return this.isGuestCheckout$;
  }

  setIsGuestCheckout(state = true): Observable<unknown> {
    this.isGuestCheckout$.next(state);

    if (state) {
      this.storage.set(
        guestCheckoutStorageKey,
        guestCheckoutStorageKey,
        StorageType.SESSION
      );
    } else {
      this.clearCheckoutData();
    }

    return this.isGuestCheckout$;
  }

  protected clearCheckoutData(): void {
    this.contactDetails$.next(null);
    this.addressDetails$.next(null);
    this.storage.remove(guestCheckoutStorageKey, StorageType.SESSION);
  }

  getContactDetails(): Observable<ContactDetails | null> {
    return this.contactDetails$;
  }

  setContactDetails(contactDetails: ContactDetails | null): void {
    this.contactDetails$.next(contactDetails);
  }

  getAddressDetails(): Observable<Address | null> {
    return this.addressDetails$;
  }

  setAddressDetails(addressDetails: Address | null): void {
    this.addressDetails$.next(addressDetails);
  }

  getShipmentDetails(): Observable<Shipment | null> {
    return this.shipmentDetails$;
  }

  setShipmentDetails(shipmentDetails: Shipment | null): void {
    this.shipmentDetails$.next(shipmentDetails);
  }

  protected getPersistedData(): void {
    this.storage
      .get<string | null>(guestCheckoutStorageKey, StorageType.SESSION)
      .subscribe((isGuestCheckout) =>
        this.isGuestCheckout$.next(!!isGuestCheckout)
      );
  }
}
