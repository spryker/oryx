import { Observable } from 'rxjs';
import { Address, ContactDetails, PaymentMethod, Shipment } from '../models';

export interface CheckoutDataService {
  isGuestCheckout(): Observable<boolean>;
  setGuestCheckout(isGuestCheckout?: boolean): Observable<unknown>;

  getCustomer(): Observable<ContactDetails | null>;
  setCustomer(data: ContactDetails | null): Observable<unknown>;

  getAddress(): Observable<Address | null>;
  setAddress(data: Address | null): Observable<unknown>;

  getShipment(): Observable<Shipment | null>;
  setShipment(data: Shipment | null): Observable<unknown>;

  getPayment(): Observable<PaymentMethod | null>;
  setPayment(data: PaymentMethod | null): Observable<unknown>;

  reset(): void;
}

export const CheckoutDataService = 'oryx.CheckoutDataService';

declare global {
  interface InjectionTokensContractMap {
    [CheckoutDataService]: CheckoutDataService;
  }
}
