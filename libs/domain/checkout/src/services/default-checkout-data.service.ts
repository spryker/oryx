import { StorageService, StorageType } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import {
  Address,
  addressCheckoutStorageKey,
  contactCheckoutStorageKey,
  ContactDetails,
  guestCheckoutStorageKey,
  paymentCheckoutStorageKey,
  PaymentMethod,
  Shipment,
  shipmentCheckoutStorageKey,
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
  protected paymentDetails$ = new BehaviorSubject<PaymentMethod | null>(null);

  isGuestCheckout(): Observable<boolean> {
    return this.isGuestCheckout$;
  }

  setGuestCheckout(isGuestCheckout = true): Observable<unknown> {
    this.isGuestCheckout$.next(isGuestCheckout);

    if (isGuestCheckout) {
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
    this.shipmentDetails$.next(null);
    this.paymentDetails$.next(null);
    this.storage.remove(guestCheckoutStorageKey, StorageType.SESSION);
    this.storage.remove(shipmentCheckoutStorageKey, StorageType.SESSION);
    this.storage.remove(paymentCheckoutStorageKey, StorageType.SESSION);
    this.storage.remove(contactCheckoutStorageKey, StorageType.SESSION);
    this.storage.remove(addressCheckoutStorageKey, StorageType.SESSION);
  }

  getCustomer(): Observable<ContactDetails | null> {
    return this.contactDetails$;
  }

  setCustomer(contactDetails: ContactDetails | null): Observable<void> {
    console.log('setCustomer', contactDetails);
    this.contactDetails$.next(contactDetails);
    return this.storage.set(
      contactCheckoutStorageKey,
      contactDetails,
      StorageType.SESSION
    );
  }

  getAddress(): Observable<Address | null> {
    return this.addressDetails$;
  }

  setAddress(addressDetails: Address | null): Observable<void> {
    console.log('setAddress', addressDetails);
    this.addressDetails$.next(addressDetails);
    return this.storage.set(
      addressCheckoutStorageKey,
      addressDetails,
      StorageType.SESSION
    );
  }

  getShipment(): Observable<Shipment | null> {
    return this.shipmentDetails$;
  }

  setShipment(shipmentDetails: Shipment | null): Observable<void> {
    console.log('setShipment', shipmentDetails);
    this.shipmentDetails$.next(shipmentDetails);
    return this.storage.set(
      shipmentCheckoutStorageKey,
      shipmentDetails,
      StorageType.SESSION
    );
  }

  getPayment(): Observable<PaymentMethod | null> {
    return this.paymentDetails$;
  }

  setPayment(paymentDetails: PaymentMethod | null): Observable<void> {
    console.log('setPayment', paymentDetails);
    this.paymentDetails$.next(paymentDetails);
    return this.storage.set(
      paymentCheckoutStorageKey,
      paymentDetails,
      StorageType.SESSION
    );
  }

  protected getPersistedData(): void {
    this.storage
      .get<string | null>(guestCheckoutStorageKey, StorageType.SESSION)
      .subscribe((isGuestCheckout) =>
        this.isGuestCheckout$.next(!!isGuestCheckout)
      );
    this.storage
      .get<Shipment | null>(shipmentCheckoutStorageKey, StorageType.SESSION)
      .subscribe((shipment) => this.shipmentDetails$.next(shipment));
    this.storage
      .get<PaymentMethod | null>(paymentCheckoutStorageKey, StorageType.SESSION)
      .subscribe((paymentMethod) => this.paymentDetails$.next(paymentMethod));
    this.storage
      .get<ContactDetails | null>(
        contactCheckoutStorageKey,
        StorageType.SESSION
      )
      .subscribe((contactDetails) => this.contactDetails$.next(contactDetails));
    this.storage
      .get<Address | null>(addressCheckoutStorageKey, StorageType.SESSION)
      .subscribe((addressDetails) => this.addressDetails$.next(addressDetails));
  }
}
