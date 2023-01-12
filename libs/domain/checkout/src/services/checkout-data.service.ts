import { Observable } from 'rxjs';
import { Address, ContactDetails, PaymentMethod, Shipment } from '../models';

export interface CheckoutDataService {
  isGuestCheckout(): Observable<boolean>;
  setGuestCheckout(isGuestCheckout?: boolean): Observable<unknown>;

  getCustomer(): Observable<ContactDetails | null>;
  setCustomer(data: ContactDetails | null): void;

  getAddress(): Observable<Address | null>;
  setAddress(data: Address | null): void;

  getShipment(): Observable<Shipment | null>;
  setShipment(data: Shipment | null): void;

  getPayment(): Observable<PaymentMethod | null>;
  setPayment(data: PaymentMethod | null): void;
}

export const CheckoutDataService = 'FES.CheckoutDataService';

declare global {
  interface InjectionTokensContractMap {
    [CheckoutDataService]: CheckoutDataService;
  }
}
