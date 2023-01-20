import { IdentityService } from '@spryker-oryx/auth';
import { StorageService, StorageType } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { BehaviorSubject, Observable, skip, Subscription, tap } from 'rxjs';
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
  protected isGuestCheckout$ = new BehaviorSubject<boolean>(false);
  protected contactDetails$ = new BehaviorSubject<ContactDetails | null>(null);
  protected addressDetails$ = new BehaviorSubject<Address | null>(null);
  protected shipmentDetails$ = new BehaviorSubject<Shipment | null>(null);
  protected paymentDetails$ = new BehaviorSubject<PaymentMethod | null>(null);

  protected subscription?: Subscription;

  constructor(
    protected storage = inject(StorageService),
    protected identity = inject(IdentityService)
  ) {
    this.init();
  }

  protected init(): void {
    this.getPersistedData();

    this.subscription = this.identity
      .get()
      .pipe(
        skip(1),
        // we want to reset checkout state every time user will change
        tap(() => this.reset())
      )
      .subscribe();
  }

  isGuestCheckout(): Observable<boolean> {
    return this.isGuestCheckout$;
  }

  setGuestCheckout(isGuestCheckout = true): Observable<unknown> {
    if (isGuestCheckout) {
      this.isGuestCheckout$.next(true);
      this.storage.set(guestCheckoutStorageKey, true, StorageType.SESSION);
    } else {
      this.reset();
    }

    return this.isGuestCheckout$;
  }

  reset(): void {
    console.log('reset');
    this.isGuestCheckout$.next(false);
    this.addressDetails$.next(null);
    this.contactDetails$.next(null);
    this.shipmentDetails$.next(null);
    this.paymentDetails$.next(null);
    this.storage.remove(guestCheckoutStorageKey, StorageType.SESSION);
    this.storage.remove(addressCheckoutStorageKey, StorageType.SESSION);
    this.storage.remove(contactCheckoutStorageKey, StorageType.SESSION);
    this.storage.remove(shipmentCheckoutStorageKey, StorageType.SESSION);
    this.storage.remove(paymentCheckoutStorageKey, StorageType.SESSION);
  }

  getCustomer(): Observable<ContactDetails | null> {
    return this.contactDetails$;
  }

  setCustomer(contactDetails: ContactDetails | null): Observable<void> {
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

  onDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
