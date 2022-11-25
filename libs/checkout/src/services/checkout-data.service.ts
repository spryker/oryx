import { Observable } from 'rxjs';
import { Address, ContactDetails } from '../models';

export interface CheckoutDataService {
  isGuestCheckout(): Observable<boolean>;
  setIsGuestCheckout(state?: boolean): Observable<unknown>;

  getContactDetails(): Observable<ContactDetails | null>;
  setContactDetails(data: ContactDetails | null): void;

  getAddressDetails(): Observable<Address | null>;
  setAddressDetails(data: Address | null): void;
}

export const CheckoutDataService = 'FES.CheckoutDataService';

declare global {
  interface InjectionTokensContractMap {
    [CheckoutDataService]: CheckoutDataService;
  }
}
